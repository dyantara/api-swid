import { Category } from "../models/Category.js";
import { success } from "../utils/response.js";

// GET: ambil semua kategori
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        return success(
            res,
            {
                count: categories.length,
                categories,
            },
            "Kategori berhasil diambil."
        );
    } catch (err) {
        next(err); // biarkan middleware errorHandler yang handle
    }
};

// POST: buat kategori baru
export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // ✅ validasi input
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Nama kategori wajib diisi.",
            });
        }

        // ✅ cek kategori duplikat
        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Kategori dengan nama ini sudah ada.",
            });
        }

        // ✅ simpan kategori baru
        const category = new Category({ name, description });
        const saved = await category.save();

        return success(res, saved, "Kategori berhasil dibuat.");
    } catch (err) {
        next(err);
    }
};
