const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password minimal 6 karakter" });
        }

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ success: false, message: "Password dan konfirmasi tidak cocok" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Format email tidak valid" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        const savedUser = await user.save();

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (err) {
        console.error("[Register Error]", err);
        res.status(500).json({ success: false, message: "Gagal registrasi", error: err.message });
    }
};

// LOGIN
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Email dan password wajib diisi" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password salah" });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({
            success: true,
            message: "Login berhasil",
            token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("[Login Error]", err);
        res.status(500).json({ success: false, message: "Gagal login", error: err.message });
    }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        res.json({
            success: true,
            message: "Profil berhasil diambil",
            data: user,
        });
    } catch (err) {
        console.error("[Get Profile Error]", err);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil profil",
            error: err.message,
        });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name, bio, avatar },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        res.json({
            success: true,
            message: "Profil berhasil diperbarui",
            data: updatedUser,
        });
    } catch (err) {
        console.error("[Update Profile Error]", err);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui profil",
            error: err.message,
        });
    }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ success: false, message: "Password lama dan baru wajib diisi" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password lama salah" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: "Password berhasil diperbarui" });
    } catch (err) {
        console.error("[Update Password Error]", err);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui password",
            error: err.message,
        });
    }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        res.json({ success: true, message: "Akun berhasil dihapus" });
    } catch (err) {
        console.error("[Delete Account Error]", err);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus akun",
            error: err.message,
        });
    }
};

// GET ALL USERS (khusus admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({
            success: true,
            message: "Daftar user berhasil diambil",
            data: users,
        });
    } catch (err) {
        console.error("[Get All Users Error]", err);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil daftar user",
            error: err.message,
        });
    }
};
