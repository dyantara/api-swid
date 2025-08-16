const Story = require("../models/Story");
const imagekit = require("../utils/imagekit");

exports.createStory = async (req, res, next) => {
    try {
        const { title, content, category, isAnonymous, email, submittedBy } = req.body;

        const file = req.file;

        if (!file) {
            return next({
                status: 400,
                message: "Gambar wajib diunggah.",
            });
        }

        const mimeType = file.mimetype;
        const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!allowedImageTypes.includes(mimeType)) {
            return next({
                status: 400,
                message: `Format gambar '${mimeType}' tidak didukung. Gunakan jpg, jpeg, png, atau webp.`,
            });
        }

        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            return next({
                status: 400,
                message: "Ukuran gambar terlalu besar. Maksimal 1MB.",
            });
        }

        // Ubah buffer jadi base64 string
        const base64File = `data:${mimeType};base64,${file.buffer.toString("base64")}`;

        // Nama file otomatis
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

            if (!uploadResponse || !uploadResponse.url) {
                return next({
                    status: 500,
                    message: "Gagal mendapatkan URL gambar dari ImageKit.",
                });
            }

            imageUrl = uploadResponse.url;
        } catch (uploadErr) {
            return next({
                status: 500,
                message: "Gagal upload gambar ke ImageKit.",
                error: uploadErr.message,
            });
        }

        const story = new Story({
            title,
            content,
            category,
            isAnonymous,
            email,
            submittedBy,
            image: imageUrl,
            status: "pending",
        });

        const saved = await story.save();

        res.status(201).json({
            message: "Cerita berhasil dikirim. Terima kasih sudah berbagi 💛",
            data: saved,
        });
    } catch (err) {
        next({
            status: 400,
            message: "Gagal mengirim cerita.",
            error: err.message,
        });
    }
};

exports.getStories = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.category) filter.category = req.query.category;

        const stories = await Story.find(filter)
            .sort({ submittedAt: -1 })
            .populate("category", "name")
            .populate("submittedBy", "name");

        res.json({
            message: "Cerita berhasil diambil",
            count: stories.length,
            data: stories,
        });
    } catch (err) {
        next({ status: 500, message: "Gagal mengambil cerita", error: err.message });
    }
};

exports.getStoryById = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate("category", "name")
            .populate("submittedBy", "name");

        if (!story) {
            return next({ status: 404, message: "Cerita tidak ditemukan" });
        }

        res.json({
            message: "Detail cerita berhasil diambil",
            data: story,
        });
    } catch (err) {
        next({
            status: 500,
            message: "Gagal mengambil detail cerita",
            error: err.message,
        });
    }
};

exports.updateStatus = async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ["pending", "approved", "rejected"]; // tambahin pending

    if (!validStatuses.includes(status)) {
        return next({
            status: 400,
            message: "Status tidak valid. Harus 'pending', 'approved', atau 'rejected'.",
        });
    }

    try {
        const story = await Story.findByIdAndUpdate(
            req.params.id,
            {
                status,
                approvedAt: status === "approved" ? new Date() : null, // reset kalau bukan approved
            },
            { new: true }
        );

        if (!story) {
            return next({ status: 404, message: "Cerita tidak ditemukan" });
        }

        res.json({
            message: `Status cerita berhasil diubah menjadi '${status}'.`,
            data: story,
        });
    } catch (err) {
        next({
            status: 500,
            message: "Gagal mengubah status cerita",
            error: err.message,
        });
    }
};


exports.deleteStory = async (req, res, next) => {
    try {
        const story = await Story.findByIdAndDelete(req.params.id);

        if (!story) {
            return next({ status: 404, message: "Cerita tidak ditemukan" });
        }

        res.json({
            message: "Cerita berhasil dihapus",
        });
    } catch (err) {
        next({
            status: 500,
            message: "Gagal menghapus cerita",
            error: err.message,
        });
    }
};

// route untuk website (hanya approved)
exports.getApprovedStories = async (req, res, next) => {
    try {
        const stories = await Story.find({ status: "approved" })
            .sort({ approvedAt: -1 })
            .populate("category", "name");

        res.json({
            message: "Cerita berhasil diambil",
            count: stories.length,
            data: stories,
        });
    } catch (err) {
        next({ status: 500, message: "Gagal mengambil cerita", error: err.message });
    }
};
