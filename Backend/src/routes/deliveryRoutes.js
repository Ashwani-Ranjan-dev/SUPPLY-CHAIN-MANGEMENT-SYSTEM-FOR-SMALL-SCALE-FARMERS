import express from "express";

import {protect} from "../middleware/authMiddleware.js";

import { getDeliveryById, getFarmerDeliveries, updateDeliveryStatus } from "../controllers/deliveryController.js";

const router = express.Router();

//Farmer deliveries
router.get(
    "/farmer",
    protect,
    getFarmerDeliveries
);

// Get Farmer Deliveries by Id
router.get(
    "/:id",
    protect,
    getDeliveryById
);

// Update Delivery
router.patch(
    "/:id/status",
    protect,
    updateDeliveryStatus,
);

export default router;