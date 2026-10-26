
import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    createReview,
    getUserReviews,
    getMyReviews,
} from "../controllers/ReviewController.js";

const router = express.Router();

// Submit a review for a completed deal.
router.post("/deal/:dealId", protect, createReview);

// Get reviews received and submitted by the logged-in user.
router.get("/me", protect, getMyReviews);

// Get the ratings and reviews for a specific user.
router.get("/user/:userId", protect, getUserReviews);

export default router;
