import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js"; // pastikan ada index.js
import connectDB from "./config/db.js"; // ✅ sudah cocok

dotenv.config();
const app = express();

// Koneksi database
connectDB();

app.use(express.json());

// CORS setup
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);

// Routes
app.use("/api/v1", routes);

// 404 handler
app.use((req, res, next) => {
    const error = new Error("Endpoint tidak ditemukan.");
    error.statusCode = 404;
    next(error);
});

// Error handler
app.use(errorHandler);

export default app; // 👉 jangan pakai app.listen()
