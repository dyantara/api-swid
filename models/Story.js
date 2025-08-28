import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Judul cerita wajib diisi."],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Isi cerita wajib diisi."],
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Kategori cerita wajib dipilih."],
        },
        image: {
            type: String,
            required: [true, "Gambar cerita wajib diunggah."],
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        approvedAt: Date,
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            validate: {
                validator: function (v) {
                    // validasi format email kalau ada isinya
                    return v === null || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: (props) => `${props.value} bukan format email yang valid.`,
            },
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Story = mongoose.model("Story", storySchema);
