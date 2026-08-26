import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Api Testing
app.get("/api/health", (req, res) => {
    const databaseStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.status(200).json({
        success: true,
        message: "KrishiConnect api is running",
        database: databaseStatus,
    });
})

app.use("/api/users" , userRoutes);

export default app;