import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            status: "fail",
            message: "You are not logged in! Please log in to get access.",
        });
    }

    try {
        // Verifikasi token dan ambil data user dari payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Cari user berdasarkan ID
        const user = await User.findById(decoded.id);

        // Jika user tidak ditemukan
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "The user belonging to this token no longer exists.",
            });
        }

        // Tambahkan informasi user ke req.user
        req.user = {
            id: user._id,
            username: user.username,
            role: user.role,
        };

        next();
    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: "Token is invalid or expired",
        });
    }
};
