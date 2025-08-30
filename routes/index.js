import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import storyRoutes from "./storyRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import articleRoutes from "./articleRoutes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/stories", storyRoutes);
router.use("/categories", categoryRoutes);
router.use("/articles", articleRoutes)

export default router;
