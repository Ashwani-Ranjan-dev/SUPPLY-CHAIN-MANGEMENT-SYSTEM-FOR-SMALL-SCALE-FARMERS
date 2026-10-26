
import mongoose from "mongoose";

import Review from "../models/ReviewSchema.js";
import Deal from "../models/DealSchema.js";
import User from "../models/userSchema.js";
import createNotification from "../utils/createNotification.js";

// ======================================================
// CREATE REVIEW
// POST /api/reviews/deal/:dealId
// ======================================================
export const createReview = async (req, res) => {
    try {
        const reviewerId = req.user._id;
        const { dealId } = req.params;
        const { rating, comment = "" } = req.body;

        if (!mongoose.isValidObjectId(dealId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid deal ID.",
            });
        }

        const numericRating = Number(rating);

        if (
            rating === undefined ||
            rating === null ||
            rating === "" ||
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a whole number from 1 to 5.",
            });
        }

        if (typeof comment !== "string") {
            return res.status(400).json({
                success: false,
                message: "Review comment must be text.",
            });
        }

        const cleanComment = comment.trim();

        if (cleanComment.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Review cannot exceed 1000 characters.",
            });
        }

        const reviewer = await User.findById(reviewerId);

        if (!reviewer) {
            return res.status(404).json({
                success: false,
                message: "Reviewer account not found.",
            });
        }

        const deal = await Deal.findById(dealId);

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: "Deal not found.",
            });
        }

        // Reviews are permitted only after deal completion.
        if (deal.status !== "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "You can review a deal only after it is completed.",
            });
        }

        const isBuyer =
            deal.buyer.toString() === reviewerId.toString();

        const isFarmer =
            deal.farmer.toString() === reviewerId.toString();

        if (!isBuyer && !isFarmer) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant in this deal.",
            });
        }

        // Notify the other participant, never the reviewer.
        const recipientId = isBuyer
            ? deal.farmer
            : deal.buyer;

        if (recipientId.toString() === reviewerId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot review yourself.",
            });
        }

        // Check for an existing review before creating another.
        const existingReview = await Review.findOne({
            deal: deal._id,
            reviewer: reviewerId,
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this deal.",
            });
        }

        const review = await Review.create({
            deal: deal._id,
            reviewer: reviewerId,
            recipient: recipientId,
            rating: numericRating,
            comment: cleanComment,
        });

        // Create the review notification for the recipient.
        // The helper catches notification errors so the saved
        // review remains successful even if notification fails.
        await createNotification({
            recipient: recipientId,
            type: "REVIEW_RECEIVED",
            title: "You received a new review",
            message: `${reviewer.name} left you a ${numericRating}-star review.`,
            entityType: "REVIEW",
            entityId: review._id,
        });

        const populatedReview = await Review.findById(review._id)
            .populate("reviewer", "name role village")
            .populate("recipient", "name role village")
            .populate(
                "deal",
                "produce quantity unit totalAmount status"
            );

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            review: populatedReview,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this deal.",
            });
        }

        console.error("Create review error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit review.",
        });
    }
};


// ======================================================
// GET REVIEWS RECEIVED BY A USER
// GET /api/reviews/user/:userId
// ======================================================

export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        const user = await User.findById(userId)
            .select("_id name role village");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const [reviews, summary] = await Promise.all([
            Review.find({ recipient: user._id })
                .populate("reviewer", "name role village")
                .populate("deal", "produce quantity unit status")
                .sort({ createdAt: -1 })
                .limit(100)
                .lean(),

            Review.aggregate([
                {
                    $match: {
                        recipient: user._id,
                    },
                },
                {
                    $group: {
                        _id: "$recipient",
                        averageRating: { $avg: "$rating" },
                        reviewCount: { $sum: 1 },
                        fiveStarCount: {
                            $sum: {
                                $cond: [{ $eq: ["$rating", 5] }, 1, 0],
                            },
                        },
                    },
                },
            ]),
        ]);

        const stats = summary[0] || {
            averageRating: 0,
            reviewCount: 0,
            fiveStarCount: 0,
        };

        return res.status(200).json({
            success: true,
            user,
            summary: {
                averageRating: Number(
                    stats.averageRating.toFixed(1)
                ),
                reviewCount: stats.reviewCount,
                fiveStarCount: stats.fiveStarCount,
            },
            reviews,
        });
    } catch (error) {
        console.error("Get user reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load reviews.",
        });
    }
};


// ======================================================
// GET MY REVIEWS
// GET /api/reviews/me
// Returns reviews received and reviews submitted by me.
// ======================================================

export const getMyReviews = async (req, res) => {
    try {
        const userId = req.user._id;

        const [received, given] = await Promise.all([
            Review.find({ recipient: userId })
                .populate("reviewer", "name role village")
                .populate("deal", "produce quantity unit status")
                .sort({ createdAt: -1 })
                .lean(),

            Review.find({ reviewer: userId })
                .populate("recipient", "name role village")
                .populate("deal", "produce quantity unit status")
                .sort({ createdAt: -1 })
                .lean(),
        ]);

        return res.status(200).json({
            success: true,
            received,
            given,
        });
    } catch (error) {
        console.error("Get my reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load your reviews.",
        });
    }
};
