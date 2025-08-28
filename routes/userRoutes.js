// routes/userRoutes.js
import express from "express";
import {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword,
    deleteAccount,
    getAllUsers,
} from "../controllers/userController.js";
import  requireRole  from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// User
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.patch("/profile/password", protect, updatePassword);
router.delete("/profile", protect, deleteAccount);

// Admin
router.get("/", protect, requireRole(["admin"]), getAllUsers);

export default router;
