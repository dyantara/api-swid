import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// CORS setup
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/stories", storyRoutes);
app.use("/api/v1/categories", categoryRoutes);

// Koneksi database
connectDB();

// port
const port = process.env.PORT;

// server
app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`);
});
