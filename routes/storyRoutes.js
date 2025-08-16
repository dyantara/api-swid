const express = require("express");
const router = express.Router();
const {
    createStory,
    getStories,
    updateStatus,
    getStoryById,
    deleteStory,
} = require("../controllers/storyController");
const authenticate = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", getStories);
router.get("/approved", getApprovedStories);
router.get("/:id", getStoryById);

router.post("/", upload.single("file"), createStory);
router.patch("/:id/status", authenticate, updateStatus);
router.delete("/:id", authenticate, deleteStory);

module.exports = router;
