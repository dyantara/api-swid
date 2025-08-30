import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        tags: [{ type: String }],
        thumbnail: { type: String },
        status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
        publishedAt: { type: Date },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        slug: { type: String, unique: true },
    },
    { timestamps: true }
);

export const Article = mongoose.model("Article", articleSchema);
