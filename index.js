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

// Konfigurasi CORS
const corsOptions = {
    origin: ["https://dev-swid.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
};

// Middleware CORS global
app.use(cors(corsOptions));

// Tambahin biar preflight OPTIONS selalu dijawab
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

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
