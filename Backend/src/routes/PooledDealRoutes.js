
import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { createPooledDeal, getBuyerPooledDeals } from "../controllers/PooledDealController.js";
import { respondToPooledDeal , getFarmerPooledDeals } from "../controllers/pooledDealResponseController.js";
const router = express.Router();

// Submit an offer for pooled produce
router.post("/", protect, createPooledDeal);

// Buyer can get their pooled deal
router.get("/buyer", protect , getBuyerPooledDeals);

// Farmer can get their Pooled deals
router.get("/farmer" , protect , getFarmerPooledDeals);

// Farmer Accept or Reject their contribution for the Offer
router.patch("/:id/respond" , protect , respondToPooledDeal);

export default router;
