// routes/storyRoutes.js
import express from "express";
import {
    createStory,
    getStories,
    updateStatus,
    deleteStory,
    getApprovedStories,
    getStoryBySlug,
} from "../controllers/storyController.js";
import  requireRole  from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getStories);
router.get("/approved", getApprovedStories);
router.post("/", upload.single("file"), createStory);
router.get("/:slug", getStoryBySlug);

// Private
router.patch("/:id/status", protect, requireRole(["admin"]), updateStatus);
router.delete("/:id", protect, requireRole(["admin"]), deleteStory);

router.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});


export default router;
