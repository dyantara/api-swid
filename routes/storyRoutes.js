const express = require("express");
const router = express.Router();
const {
    createStory,
    getStories,
    updateStatus,
    getStoryById,
    deleteStory,
    getApprovedStories,
} = require("../controllers/storyController");

const authenticate = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// PUBLIC
router.get("/", getStories);
router.get("/approved", getApprovedStories);
router.get("/:id", getStoryById);

// PRIVATE
router.post("/", authenticate, upload.single("file"), createStory);
router.patch("/:id/status", authenticate, updateStatus);
router.delete("/:id", authenticate, deleteStory);

module.exports = router;
