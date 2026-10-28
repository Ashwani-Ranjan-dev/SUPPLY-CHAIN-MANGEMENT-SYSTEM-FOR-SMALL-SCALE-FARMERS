
import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    confirmFarmerSettlement,
} from "../controllers/settlementController.js";

const router = express.Router();

// Confirm receipt of settlement for a completed farmer deal.
router.post(
    "/farmer/confirm",
    protect,
    confirmFarmerSettlement
);

export default router;
