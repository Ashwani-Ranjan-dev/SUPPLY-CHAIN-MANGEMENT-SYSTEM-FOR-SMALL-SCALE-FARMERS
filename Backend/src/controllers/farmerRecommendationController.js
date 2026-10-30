
import mongoose from "mongoose";

import Deal from "../models/DealSchema.js";
import Review from "../models/ReviewSchema.js";

import {
    rankBuyerOffers,
} from "../services/aiMarketplace/rankingEngine.js";

import {
    explainFarmerRecommendationWithFallback,
} from "../services/aiMarketplace/explanationOrchestrator.js";

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

        // 2. Validate the requested result limit.
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

        // 3. Fetch pending offers addressed to this farmer.
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

        // Exclude offers with missing references or invalid buyers.
        const validDeals = deals.filter(
            (deal) =>
                deal.buyer &&
                deal.buyer.role === "BUYER" &&
                deal.produce
        );

        // 4. Aggregate reviews received by candidate buyers.
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

        // 5. Prepare actual deal records for the ranking engine.
        const offersForRanking = validDeals.map((deal) => ({
            ...deal,
            _id: String(deal._id),
            buyer: String(deal.buyer._id),
            produce: String(deal.produce._id),

            ...(ratingsByBuyer.get(
                String(deal.buyer._id)
            ) || {}),

            // Do not invent buyer reliability or farmer cost data.
        }));

        // 6. Rank pending offers using the existing ranking engine.
        const rankedOffers = rankBuyerOffers(
            offersForRanking
        );

        const dealsById = new Map(
            validDeals.map((deal) => [
                String(deal._id),
                deal,
            ])
        );

        // 7. Generate explanations asynchronously.
        // Promise.all waits for the explanations before returning.
        const recommendations = await Promise.all(
            rankedOffers
                .slice(0, requestedLimit)
                .map(async (result, index) => {
                    const deal = dealsById.get(
                        String(result.dealId)
                    );

                    const explanation =
                        await explainFarmerRecommendationWithFallback({
                            ...result,

                            // Pass factual offer details from the original deal.
                            quantity: deal?.quantity,
                            unit: deal?.unit,
                            offeredPrice: deal?.offeredPrice,
                            grossDealValue: deal?.totalAmount,
                            status: deal?.status,

                            // Pass the associated produce details.
                            produce: deal?.produce
                                ? {
                                    crop: deal.produce.crop,
                                    quality: deal.produce.quality,
                                    location: deal.produce.location,
                                }
                                : null,
                        });

                    return {
                        rank: index + 1,
                        ...result,

                        // AI-generated explanation with rule-based fallback.
                        explanation,

                        // Public buyer details only.
                        buyer: deal
                            ? {
                                id: String(deal.buyer._id),
                                name: deal.buyer.name,
                                village: deal.buyer.village,
                            }
                            : null,

                        // Associated produce details.
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
                })
        );

        // 8. Return recommendations to the farmer.
        return res.status(200).json({
            success: true,

            message: recommendations.length
                ? "Farmer buyer recommendations generated successfully."
                : "No pending buyer offers are available for your produce.",

            count: recommendations.length,
            scannedOffers: validDeals.length,

            truncated:
                deals.length === MAX_OFFERS_TO_COMPARE,

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
