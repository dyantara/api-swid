import {Story} from "../models/Story.js";
import imagekit from "../utils/imagekit.js";
import { success, fail, error } from "../utils/response.js";


// Create new story
export const createStory = async (req, res) => {
    try {
        const { title, content, category, isAnonymous } = req.body;
        const file = req.file;

        if (!file) return fail(res, "Gambar wajib diunggah.", 400);

        const mimeType = file.mimetype;
        const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedImageTypes.includes(mimeType)) {
            return fail(
                res,
                `Format gambar '${mimeType}' tidak didukung. Gunakan jpg, jpeg, png, atau webp.`,
                400
            );
        }

        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            return fail(res, "Ukuran gambar terlalu besar. Maksimal 1MB.", 400);
        }

        // Ubah buffer ke base64
        const base64File = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
        const extension = mimeType.split("/")[1];
        const autoFileName = `story-${Date.now()}.${extension}`;

        // Upload ke ImageKit
        let imageUrl;
        try {
            const uploadResponse = await imagekit.upload({
                file: base64File,
                fileName: autoFileName,
                folder: "story-images",
            });

            if (!uploadResponse?.url)
                return error(res, "Gagal mendapatkan URL gambar dari ImageKit.");
            imageUrl = uploadResponse.url;
        } catch (uploadErr) {
            return error(res, "Gagal upload gambar ke ImageKit: " + uploadErr.message, 500);
        }

        // Buat story baru
        const story = new Story({
            title,
            content,
            category,
            isAnonymous,
            submittedBy: req.user.userId, // ✅ dari token
            image: imageUrl,
            status: "pending",
        });

        const saved = await story.save();
        return success(res, saved, "Cerita berhasil dikirim. Terima kasih sudah berbagi 💛", 201);
    } catch (err) {
        return error(res, "Gagal mengirim cerita: " + err.message, 400);
    }
};

// Get all stories (filter by status/category)
export const getStories = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.category) filter.category = req.query.category;

        const stories = await Story.find(filter)
            .sort({ submittedAt: -1 })
            .populate("category", "name")
            .populate("submittedBy", "name email");

        return success(res, stories, "Cerita berhasil diambil");
    } catch (err) {
        return error(res, "Gagal mengambil cerita: " + err.message);
    }
};

// Get story by ID
export const getStoryById = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate("category", "name")
            .populate("submittedBy", "name email");

        if (!story) return fail(res, "Cerita tidak ditemukan", 404);

        return success(res, story, "Detail cerita berhasil diambil");
    } catch (err) {
        return error(res, "Gagal mengambil detail cerita: " + err.message);
    }
};

// Update status (pending/approved/rejected)
export const updateStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["pending", "approved", "rejected"];

    if (!validStatuses.includes(status)) {
        return fail(res, "Status tidak valid. Harus 'pending', 'approved', atau 'rejected'.", 400);
    }

    try {
        const story = await Story.findByIdAndUpdate(
            req.params.id,
            {
                status,
                approvedAt: status === "approved" ? new Date() : null,
            },
            { new: true }
        );

        if (!story) return fail(res, "Cerita tidak ditemukan", 404);

        return success(res, story, `Status cerita berhasil diubah menjadi '${status}'.`);
    } catch (err) {
        return error(res, "Gagal mengubah status cerita: " + err.message);
    }
};

// Delete story
export const deleteStory = async (req, res) => {
    try {
        const story = await Story.findByIdAndDelete(req.params.id);
        if (!story) return fail(res, "Cerita tidak ditemukan", 404);

        return success(res, null, "Cerita berhasil dihapus");
    } catch (err) {
        return error(res, "Gagal menghapus cerita: " + err.message);
    }
};

// Get only approved stories
export const getApprovedStories = async (req, res) => {
    try {
        const stories = await Story.find({ status: "approved" })
            .sort({ approvedAt: -1 })
            .populate("category", "name")
            .populate("submittedBy", "name email");

        return success(res, stories, "Cerita berhasil diambil");
    } catch (err) {
        return error(res, "Gagal mengambil cerita: " + err.message);
    }
};
