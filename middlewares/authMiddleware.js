import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { error as errorResponse } from "../utils/response.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return errorResponse(res, "You are not logged in! Please log in to get access.", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return errorResponse(res, "The user belonging to this token no longer exists.", 401);
        }

        req.user = user; // simpan full user object

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return errorResponse(res, "Your token has expired. Please log in again.", 401);
        }
        return errorResponse(res, "Token is invalid", 401, error);
    }
};

export default protect;
