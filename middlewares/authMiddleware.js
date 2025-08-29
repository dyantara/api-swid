import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import { success as successResponse, error as errorResponse } from "../utils/response.js";


const protect = async (req, res, next) => {
    let token;

    // ✅ Ambil token dari header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // ❌ Kalau nggak ada token
    if (!token) {
        return errorResponse(res, "You are not logged in! Please log in to get access.", 401);
    }

    try {
        // ✅ Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ pakai decoded.userId (harus sama dengan payload waktu sign token)
        const user = await User.findById(decoded.userId);

        if (!user) {
            return errorResponse(res, "The user belonging to this token no longer exists.", 401);
        }

        // ✅ Simpan data user ke req
        req.user = {
            userId: user._id,
            name: user.name,
            role: user.role,
        };

        next();
    } catch (error) {
        return errorResponse(res, "Token is invalid or expired", 401, error);
    }
};

export default protect;
