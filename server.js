const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Koneksi database
connectDB();

app.use(express.json());

// CORS setup
app.use(
    cors({
        origin: ["https://dev-swid.vercel.app", "http://localhost:5173"],
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

module.exports = app; // 👉 jangan pakai app.listen()
