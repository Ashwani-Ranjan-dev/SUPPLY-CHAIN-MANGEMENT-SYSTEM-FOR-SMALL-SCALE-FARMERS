
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    createPooledDelivery,
    getBuyerPooledDeliveries,
    getFarmerPooledDeliveries,
    getPooledDeliveryById,
    updatePooledDeliveryStatus,
} from "../controllers/PooledDeliveryController.js";

const router = express.Router();

// Keep named routes before /:id.
router.post("/", protect, createPooledDelivery);

router.get("/buyer", protect, getBuyerPooledDeliveries);

router.get("/farmer", protect, getFarmerPooledDeliveries);

router.get("/:id", protect, getPooledDeliveryById);

router.patch(
    "/:id/status",
    protect,
    updatePooledDeliveryStatus
);

export default router;
