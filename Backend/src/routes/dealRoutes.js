import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    createDeal,
    getFarmerDeals,
    getBuyerDeals,
    acceptDeal,
    rejectDeal,
} from "../controllers/dealController.js";

const router = express.Router();


// ======================================================
// BUYER
// ======================================================

// Buyer creates a deal offer
router.post(
    "/",
    protect,
    createDeal
);


// Buyer gets all their deals
router.get(
    "/buyer",
    protect,
    getBuyerDeals
);


// ======================================================
// FARMER
// ======================================================

// Farmer gets all received deals
router.get(
    "/farmer",
    protect,
    getFarmerDeals
);


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