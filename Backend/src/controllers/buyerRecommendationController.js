
import mongoose from "mongoose";

import Produce from "../models/ProduceSchema.js";
import Review from "../models/ReviewSchema.js";

import {
    rankProduceListings,
    UNIT_TO_KG,
} from "../services/aiMarketplace/rankingEngine.js";

import {
    explainBuyerRecommendationWithFallback,
} from "../services/aiMarketplace/explanationOrchestrator.js";

const MAX_LISTINGS_TO_COMPARE = 200;
const MAX_RESULTS = 50;

const ALLOWED_UNITS = new Set(Object.keys(UNIT_TO_KG));

const ALLOWED_QUALITIES = new Set([
    "STANDARD",
    "GOOD",
    "PREMIUM",
]);

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

const isValidPositiveNumber = (value) =>
    value !== undefined &&
    value !== "" &&
    Number.isFinite(Number(value)) &&
    Number(value) > 0;

const isValidNonNegativeNumber = (value) =>
    value !== undefined &&
    value !== "" &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0;

// Escape user input before using it in a regular expression.
const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/buyer/recommendations
export const getBuyerRecommendations = async (req, res) => {
    try {
        // 1. Role authorization
        if (req.user?.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only buyers can access produce recommendations.",
            });
        }

        // 2. Read query parameters
        const {
            crop,
            quantity,
            unit,
            maxPricePerUnit,
            preferredQuality,
            location,
            limit,
        } = req.query;

        const cleanCrop = isNonEmptyString(crop)
            ? crop.trim()
            : "";

        const cleanLocation = isNonEmptyString(location)
            ? location.trim()
            : "";

        const cleanUnit = isNonEmptyString(unit)
            ? unit.trim().toUpperCase()
            : "";

        const cleanQuality = isNonEmptyString(preferredQuality)
            ? preferredQuality.trim().toUpperCase()
            : "";

        // Validate crop
        if (crop !== undefined && !cleanCrop) {
            return res.status(400).json({
                success: false,
                message: "Crop must not be empty.",
            });
        }

        // Validate location
        if (location !== undefined && !cleanLocation) {
            return res.status(400).json({
                success: false,
                message: "Location must not be empty.",
            });
        }

        // Validate quantity
        if (
            quantity !== undefined &&
            !isValidPositiveNumber(quantity)
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive number.",
            });
        }

        // Validate maximum price
        if (
            maxPricePerUnit !== undefined &&
            !isValidNonNegativeNumber(maxPricePerUnit)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "maxPricePerUnit must be a non-negative number.",
            });
        }

        // A maximum price must have a valid unit.
        if (
            maxPricePerUnit !== undefined &&
            !ALLOWED_UNITS.has(cleanUnit)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A valid unit (KG, QUINTAL, or TON) is required when maxPricePerUnit is supplied.",
            });
        }

        // Validate unit
        if (
            unit !== undefined &&
            !ALLOWED_UNITS.has(cleanUnit)
        ) {
            return res.status(400).json({
                success: false,
                message: "Unit must be KG, QUINTAL, or TON.",
            });
        }

        // Validate preferred quality
        if (
            preferredQuality !== undefined &&
            !ALLOWED_QUALITIES.has(cleanQuality)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "preferredQuality must be STANDARD, GOOD, or PREMIUM.",
            });
        }

        // Validate result limit
        const requestedLimit =
            limit === undefined ? 10 : Number(limit);

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

        // 3. Fetch active produce listings
        const filter = {
            status: "ACTIVE",
        };

        if (cleanCrop) {
            filter.crop = new RegExp(
                `^${escapeRegex(cleanCrop)}$`,
                "i"
            );
        }

        if (cleanLocation) {
            filter.location = new RegExp(
                `^${escapeRegex(cleanLocation)}$`,
                "i"
            );
        }

        const listings = await Produce.find(filter)
            .select(
                "_id farmer crop quantity unit expectedPrice location quality availableFrom status createdAt"
            )
            .populate("farmer", "name village role")
            .sort({ createdAt: -1, _id: 1 })
            .limit(MAX_LISTINGS_TO_COMPARE)
            .lean();

        // Exclude listings with missing or invalid farmer records.
        const validListings = listings.filter(
            (listing) =>
                listing.farmer &&
                listing.farmer.role === "FARMER"
        );

        // 4. Aggregate ratings for candidate farmers
        const farmerIds = [
            ...new Set(
                validListings.map((listing) =>
                    String(listing.farmer._id)
                )
            ),
        ];

        const ratingRows = farmerIds.length
            ? await Review.aggregate([
                  {
                      $match: {
                          recipient: {
                              $in: farmerIds.map(
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

        const ratingsByFarmer = new Map(
            ratingRows.map((row) => [
                String(row._id),
                {
                    sellerRating: Number(
                        row.averageRating.toFixed(1)
                    ),
                    sellerReviewCount: row.reviewCount,
                },
            ])
        );

        // 5. Prepare ranking inputs
        const rankingListings = validListings.map((listing) => {
            const rating = ratingsByFarmer.get(
                String(listing.farmer._id)
            );

            return {
                ...listing,
                _id: String(listing._id),
                farmer: String(listing.farmer._id),
                ...(rating || {}),
            };
        });

        // 6. Rank listings using the existing deterministic engine
        const rankedResults = rankProduceListings(
            rankingListings,
            {
                ...(cleanCrop
                    ? { crop: cleanCrop }
                    : {}),

                ...(quantity !== undefined
                    ? {
                          quantity: Number(quantity),
                          unit: cleanUnit,
                      }
                    : {}),

                ...(maxPricePerUnit !== undefined
                    ? {
                          maxPricePerUnit:
                              Number(maxPricePerUnit),
                      }
                    : {}),

                ...(cleanQuality
                    ? { preferredQuality: cleanQuality }
                    : {}),

                ...(cleanLocation
                    ? { location: cleanLocation }
                    : {}),
            }
        );

        // 7. Map ranked listings and generate explanations.
        // Promise.all allows explanation requests to run concurrently.
        const listingById = new Map(
            validListings.map((listing) => [
                String(listing._id),
                listing,
            ])
        );

        const recommendations = await Promise.all(
            rankedResults
                .slice(0, requestedLimit)
                .map(async (result, index) => {
                    const listing = listingById.get(
                        String(result.listingId)
                    );

                    const explanation =
                        await explainBuyerRecommendationWithFallback({
                            ...result,
                            crop: result.crop,
                            quality: result.quality,
                            expectedPrice: result.expectedPrice,
                            unit: result.unit,
                            reasons: result.reasons,
                            scoreBreakdown: result.scoreBreakdown,
                            availableWeightPercent:
                                result.availableWeightPercent,
                            confidence: result.confidence,
                            limitations: result.limitations,
                        });

                    return {
                        rank: index + 1,
                        ...result,

                        // Explanation comes from the orchestrator.
                        explanation,

                        // Expose public seller details only.
                        // Never return the seller's phone number.
                        farmer: listing
                            ? {
                                  id: String(listing.farmer._id),
                                  name: listing.farmer.name,
                                  village: listing.farmer.village,
                              }
                            : null,
                    };
                })
        );

        // 8. Return recommendations
        return res.status(200).json({
            success: true,

            message: recommendations.length
                ? "Buyer recommendations generated successfully."
                : "No eligible listings matched the supplied criteria.",

            criteria: {
                crop: cleanCrop || null,

                quantity:
                    quantity !== undefined
                        ? Number(quantity)
                        : null,

                unit: cleanUnit || null,

                maxPricePerUnit:
                    maxPricePerUnit !== undefined
                        ? Number(maxPricePerUnit)
                        : null,

                preferredQuality: cleanQuality || null,
                location: cleanLocation || null,
            },

            count: recommendations.length,
            scannedListings: validListings.length,

            truncated:
                listings.length === MAX_LISTINGS_TO_COMPARE,

            dataLimitations: [
                "Only the most recently created eligible listings within the scan limit are compared.",
                "Listing quality categories are not independent quality certifications.",
                "Distance and reliability are not scored because the current schema does not provide verified values for them.",
                "Review ratings reflect reviews received; they do not guarantee future seller performance.",
            ],

            recommendations,
        });
    } catch (error) {
        console.error(
            "Buyer recommendation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to generate buyer recommendations.",
        });
    }
};
