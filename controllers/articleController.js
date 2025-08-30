import { Article } from "../models/Article.js";
import imagekit from "../utils/imagekit.js";
import { success, fail, error } from "../utils/response.js";

// CREATE ARTICLE
export const createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;

        // category bisa kosong string dari FormData
        const category = req.body.category?.trim() ? req.body.category.trim() : undefined;

        // status dari FormData -> default ke "draft" kalau tidak "published"
        const rawStatus = (req.body.status || "").toString();
        const status = rawStatus === "published" ? "published" : "draft";

        let tags = [];
        if (req.body.tags) {
            tags = JSON.parse(req.body.tags);
        }

        // upload thumbnail jika ada
        let thumbnailUrl = null;
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `article_${Date.now()}.jpg`,
                folder: "articles",
            });
            thumbnailUrl = uploadResponse.url;
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");

        const article = await Article.create({
            title,
            content,
            author: req.user._id, // <- dari middleware protect
            category,
            tags,
            thumbnail: thumbnailUrl,
            slug,
            status, // <- simpan status!
            publishedAt: status === "published" ? new Date() : undefined,
        });

        return success(res, article, "Article created", 201);
    } catch (err) {
        console.error(err);
        return error(res, err.message);
    }
};

// GET ALL
export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate("author", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });

        return success(res, articles, "List of articles");
    } catch (err) {
        return error(res, err.message);
    }
};

// GET BY ID
export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate("author", "name email")
            .populate("category", "name");

        if (!article) return fail(res, "Article not found", 404);

        return success(res, article, "Article detail");
    } catch (err) {
        return error(res, err.message);
    }
};

// APPROVE / REJECT
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body; // draft, published, archived
        if (!["draft", "published", "archived"].includes(status)) {
            return fail(res, "Invalid status", 400);
        }

        const article = await Article.findByIdAndUpdate(
            req.params.id,
            {
                status,
                publishedAt: status === "published" ? new Date() : null,
            },
            { new: true }
        );

        if (!article) return fail(res, "Article not found", 404);

        return success(res, article, `Article ${status}`);
    } catch (err) {
        return error(res, err.message);
    }
};

// UPDATE (EDIT)
export const updateArticle = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        let updateData = { title, content, category, tags };

        // kalau upload thumbnail baru
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `article_${Date.now()}.jpg`,
                folder: "articles",
            });
            updateData.thumbnail = uploadResponse.url;
        }

        const article = await Article.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        if (!article) return fail(res, "Article not found", 404);

        return success(res, article, "Article updated");
    } catch (err) {
        return error(res, err.message);
    }
};

// DELETE
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) return fail(res, "Article not found", 404);

        return success(res, null, "Article deleted");
    } catch (err) {
        return error(res, err.message);
    }
};

// GET BY SLUG
export const getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
            .populate("author", "name email")
            .populate("category", "name");

        if (!article) return fail(res, "Article not found", 404);

        return success(res, article, "Article detail by slug");
    } catch (err) {
        return error(res, err.message);
    }
};
