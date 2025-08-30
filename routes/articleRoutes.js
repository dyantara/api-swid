import express from "express";
import multer from "multer";
import {
    createArticle,
    getArticles,
    updateStatus,
    updateArticle,
    deleteArticle,
    getArticleBySlug,
} from "../controllers/articleController.js";
import protect from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";

const router = express.Router();
const upload = multer(); // pakai memory storage (buffer)

// GET artikel publik (semua user bisa akses tanpa login)
router.get("/", getArticles);
// router.get("/:id", getArticleById);
router.get("/:slug", getArticleBySlug);

// CRUD (hanya user login)
router.post("/", protect, upload.single("thumbnail"), createArticle);
router.put("/:id", protect, upload.single("thumbnail"), updateArticle);
router.delete("/:id", protect, deleteArticle);

// APPROVE / REJECT (khusus admin/editor)
router.patch("/:id/status", protect, requireRole(["admin", "moderator"]), updateStatus);

export default router;
