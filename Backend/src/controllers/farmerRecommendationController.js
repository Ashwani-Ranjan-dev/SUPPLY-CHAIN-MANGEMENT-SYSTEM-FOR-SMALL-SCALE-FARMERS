
import mongoose from "mongoose";

import Deal from "../models/DealSchema.js";
import Review from "../models/ReviewSchema.js";

import {
    rankBuyerOffers,
} from "../services/aiMarketplace/rankingEngine.js";

const MAX_OFFERS_TO_COMPARE = 200;
const MAX_RESULTS = 50;

// GET /api/deals/farmer/recommendations
export const getFarmerRecommendations = async (req, res) => {
    try {
        // 1. The authenticated user must be a farmer.
        if (req.user?.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can access buyer recommendations.",
            });
        }

        const requestedLimit =
            req.query.limit === undefined
                ? 10
                : Number(req.query.limit);

        if (
            !Number.isInteger(requestedLimit) ||
            requestedLimit < 1 ||
            requestedLimit > MAX_RESULTS
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `limit must be an integer from 1 to ${MAX_RESULTS}.`,
            });
        }

        // 2. Find only pending offers addressed to this farmer.
        // Never accept a farmer ID from the query string.
        const deals = await Deal.find({
            farmer: req.user._id,
            status: "PENDING",
        })
            .select(
                "_id farmer buyer produce quantity unit offeredPrice totalAmount status createdAt"
            )
            .populate("buyer", "name village role")
            .populate("produce", "crop location quality")
            .sort({ createdAt: -1, _id: 1 })
            .limit(MAX_OFFERS_TO_COMPARE)
            .lean();

        // Ensure buyer and produce references still exist and the
        // populated buyer has the expected role.
        const validDeals = deals.filter(
            (deal) =>
                deal.buyer &&
                deal.buyer.role === "BUYER" &&
                deal.produce
        );

        // 3. Aggregate reviews received by these buyers.
        const buyerIds = [
            ...new Set(
                validDeals.map((deal) =>
                    String(deal.buyer._id)
                )
            ),
        ];

        const ratingRows = buyerIds.length
            ? await Review.aggregate([
                {
                    $match: {
                        recipient: {
                            $in: buyerIds.map(
                                (id) =>
                                    new mongoose.Types.ObjectId(id)
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: "$recipient",
                        averageRating: { $avg: "$rating" },
                        reviewCount: { $sum: 1 },
                    },
                },
            ])
            : [];

        const ratingsByBuyer = new Map(
            ratingRows.map((row) => [
                String(row._id),
                {
                    buyerRating: Number(
                        row.averageRating.toFixed(1)
                    ),
                    buyerReviewCount: row.reviewCount,
                },
            ])
        );

        // 4. Prepare real deal records for the ranking engine.
        const offersForRanking = validDeals.map((deal) => ({
            ...deal,
            _id: String(deal._id),
            buyer: String(deal.buyer._id),
            produce: String(deal.produce._id),
            ...(ratingsByBuyer.get(String(deal.buyer._id)) || {}),

            // No buyer reliability metric or farmer-borne cost
            // data is invented here.
        }));

        // 5. Rank pending offers using the Phase 2 engine.
        const rankedOffers = rankBuyerOffers(offersForRanking);

        const dealsById = new Map(
            validDeals.map((deal) => [
                String(deal._id),
                deal,
            ])
        );

        // 6. Attach useful public buyer and produce information.
        const recommendations = rankedOffers
            .slice(0, requestedLimit)
            .map((result, index) => {
                const deal = dealsById.get(result.dealId);

                return {
                    rank: index + 1,
                    ...result,

                    buyer: deal
                        ? {
                            id: String(deal.buyer._id),
                            name: deal.buyer.name,
                            village: deal.buyer.village,
                        }
                        : null,

                    produce: deal
                        ? {
                            id: String(deal.produce._id),
                            crop: deal.produce.crop,
                            location: deal.produce.location,
                            quality: deal.produce.quality,
                        }
                        : null,

                    createdAt: deal?.createdAt ?? null,
                };
            });

        return res.status(200).json({
            success: true,
            message: recommendations.length
                ? "Farmer buyer recommendations generated successfully."
                : "No pending buyer offers are available for your produce.",

            count: recommendations.length,
            scannedOffers: validDeals.length,
            truncated: deals.length === MAX_OFFERS_TO_COMPARE,

            dataLimitations: [
                "Only pending offers addressed to the authenticated farmer are included.",
                "Buyer ratings reflect reviews received and do not guarantee future performance.",
                "Unknown buyer reliability is not scored.",
                "Net earnings are not calculated because farmer-borne costs are not recorded in the current deal model.",
                "An offer or accepted deal does not prove payment has succeeded.",
            ],

            recommendations,
        });
    } catch (error) {
        console.error(
            "Farmer recommendation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to generate farmer recommendations.",
        });
    }
};
