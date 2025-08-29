// routes/categoryRoutes.js
import express from "express";
import {
    createCategory,
    getCategories,
} from "../controllers/categoryController.js";
import requireRole from "../middlewares/roleMiddleware.js";

import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getCategories);

// Private (only admin)
router.post("/", protect, requireRole(["admin"]), createCategory);
// router.put("/:id", protect, requireRole(["admin"]), updateCategory);
// router.delete("/:id", protect, requireRole(["admin"]), deleteCategory);

export default router;
