import { Category } from "../models/Category.js";
import { success, fail, error } from "../utils/response.js";

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
        next({
            status: 500,
            message: "Gagal mengambil kategori",
            error: err,
        });
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const category = new Category(req.body);
        const saved = await category.save();
        return success(res, saved, "Kategori berhasil dibuat.");
    } catch (err) {
        next({
            status: 400,
            message: "Gagal membuat kategori",
            error: err,
        });
    }
};
