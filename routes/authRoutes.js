// routes/authRoutes.js
import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { login } from "../controllers/userController.js";

const router = express.Router();

// Public
router.post("/login", login);

// Protected example
router.get("/protected", protect, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "This is a protected route",
        user: req.user,
    });
});

export default router;
