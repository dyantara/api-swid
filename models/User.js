import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "moderator", "admin"],
            default: "user",
        },

        bio: {
            type: String,
            default: "",
        },

        avatar: {
            type: String,
            default: "",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
