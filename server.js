const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Koneksi database
connectDB();

app.use(express.json());

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

// Routes
app.use("/api/v1/", routes);

// 404 handler
app.use((req, res, next) => {
    const error = new Error("Endpoint tidak ditemukan.");
    error.statusCode = 404;
    next(error);
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
