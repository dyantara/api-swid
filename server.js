import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(express.json());

// CORS setup
app.use(
    cors({
        origin: ["http://localhost:5173", "https://swid.vercel.app"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

// Routes
app.use("/api/v1", router);

// Koneksi database
connectDB();

// port
const port = process.env.PORT;

// server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
