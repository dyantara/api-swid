const express = require("express");
const router = express.Router();

// Pastikan import-nya sesuai dengan export di controller
const {
    createStory,
    getStories,
    updateStatus,
    getStoryById,
    deleteStory,
} = require("../controllers/storyController");

// Pastikan middleware ini ada dan benar isinya
const authenticate = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// Route publik (misalnya lihat semua cerita)
router.get("/", getStories);
router.get("/:id", getStoryById);

// Route yang butuh autentikasi
router.post("/", upload.single("file"), authenticate, createStory);
router.patch("/:id/status", authenticate, updateStatus);
router.delete("/:id", authenticate, deleteStory);

module.exports = router;
