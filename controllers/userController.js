import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { success, fail, error } from "../utils/response.js";

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return fail(res, "Semua field wajib diisi", 400);
        }

        if (password.length < 6) {
            return fail(res, "Password minimal 6 karakter", 400);
        }

        if (password !== confirmPassword) {
            return fail(res, "Password dan konfirmasi tidak cocok", 400);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return fail(res, "Format email tidak valid", 400);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return fail(res, "Email sudah terdaftar", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        const savedUser = await user.save();

        return success(
            res,
            {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
            "Registrasi berhasil",
            201
        );
    } catch (err) {
        console.error("[Register Error]", err);
        return error(res, "Gagal registrasi", 500);
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return fail(res, "Email dan password wajib diisi", 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return fail(res, "User tidak ditemukan", 404);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return fail(res, "Password salah", 400);
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return success(
            res,
            {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            "Login berhasil"
        );
    } catch (err) {
        console.error("[Login Error]", err);
        return error(res, "Gagal login", 500);
    }
};

// GET PROFILE
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return fail(res, "User tidak ditemukan", 404);

        return success(res, user, "Profil berhasil diambil");
    } catch (err) {
        console.error("[Get Profile Error]", err);
        return error(res, "Gagal mengambil profil", 500);
    }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name, bio, avatar },
            { new: true }
        ).select("-password");

        if (!updatedUser) return fail(res, "User tidak ditemukan", 404);

        return success(res, updatedUser, "Profil berhasil diperbarui");
    } catch (err) {
        console.error("[Update Profile Error]", err);
        return error(res, "Gagal memperbarui profil", 500);
    }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return fail(res, "Password lama dan baru wajib diisi", 400);
        }

        if (newPassword.length < 6) {
            return fail(res, "Password baru minimal 6 karakter", 400);
        }

        const user = await User.findById(req.user.userId);
        if (!user) return fail(res, "User tidak ditemukan", 404);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return fail(res, "Password lama salah", 400);

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return success(res, {}, "Password berhasil diperbarui");
    } catch (err) {
        console.error("[Update Password Error]", err);
        return error(res, "Gagal memperbarui password", 500);
    }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
        if (!user) return fail(res, "User tidak ditemukan", 404);

        return success(res, {}, "Akun berhasil dihapus");
    } catch (err) {
        console.error("[Delete Account Error]", err);
        return error(res, "Gagal menghapus akun", 500);
    }
};

// GET ALL USERS (khusus admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return success(res, users, "Daftar user berhasil diambil");
    } catch (err) {
        console.error("[Get All Users Error]", err);
        return error(res, "Gagal mengambil daftar user", 500);
    }
};
