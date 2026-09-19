import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    createDeal,
    getFarmerDeals,
    acceptDeal,
    rejectDeal,
} from "../controllers/dealController.js";

const router = express.Router();


// Buyer creates an offer
router.post("/", protect, createDeal);


// Farmer gets all their deals
router.get("/farmer", protect, getFarmerDeals);


// Farmer accepts a pending deal
router.patch(
    "/:id/accept",
    protect,
    acceptDeal
);


// Farmer rejects a pending deal
router.patch(
    "/:id/reject",
    protect,
    rejectDeal
);

export default router;