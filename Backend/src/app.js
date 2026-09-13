import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import authroutes from "./routes/authroutes.js";
import cookieParser from "cookie-parser";
import FarmerRoutes from "./routes/farmerroutes.js";

const app = express();

// Middleware
app.use(
    cors({
    origin : "http://localhost:5173",
    credentials: true,
})
);

app.use(express.json());
app.use(cookieParser());

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

app.use("/api/auth" , authroutes);

app.use("/api/farmer" , FarmerRoutes);

export default app;