
import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { createPooledDeal } from "../controllers/PooledDealController.js";
import { respondToPooledDeal } from "../controllers/pooledDealResponseController.js";
const router = express.Router();

// Submit an offer for pooled produce
router.post("/", protect, createPooledDeal);

// Farmer Accept or Reject their contribution for the Offer
router.post("/:id/respond" , protect , respondToPooledDeal);

export default router;
