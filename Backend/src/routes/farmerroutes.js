import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { getfarmerDashboard } from "../controllers/farmercontroller.js";

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    getfarmerDashboard
);

export default router;