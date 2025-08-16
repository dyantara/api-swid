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

// Middleware
app.use(
    cors({
        origin: ["https://dev-swid.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.options("*", cors()); // handle preflight

app.use((req, res, next) => {
    const allowedOrigins = ["https://dev-swid.vercel.app", "http://localhost:5173"];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

// 404 Handler
app.use((req, res, next) => {
    const error = new Error("Endpoint tidak ditemukan.");
    error.statusCode = 404;
    next(error);
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
