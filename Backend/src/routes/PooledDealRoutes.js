
import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { createPooledDeal } from "../controllers/PooledDealController.js";

const router = express.Router();

// Submit an offer for pooled produce
router.post("/", protect, createPooledDeal);

export default router;
