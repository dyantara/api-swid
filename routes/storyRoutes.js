// routes/storyRoutes.js
import express from "express";
import {
    createStory,
    getStories,
    updateStatus,
    getStoryById,
    deleteStory,
    getApprovedStories,
} from "../controllers/storyController.js";
import  requireRole  from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getStories);
router.get("/approved", getApprovedStories);
router.get("/:id", getStoryById);

// Private
router.post("/", protect, upload.single("file"), createStory);
router.patch("/:id/status", protect, requireRole(["admin"]), updateStatus);
router.delete("/:id", protect, requireRole(["admin"]), deleteStory);

router.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});


export default router;
