
/**
 * KrishiConnect AI Marketplace Agent — Phase 2
 *
 * Pure, deterministic ranking utilities.
 * No database, network, Express, or AI-provider dependency.
 *
 * Listing expectedPrice and Deal offeredPrice are assumed to be quoted
 * per the item's unit, consistent with the existing project data model.
 */

export const UNIT_TO_KG = Object.freeze({
    KG: 1,
    QUINTAL: 100,
    TON: 1000,
});

export const DEFAULT_WEIGHTS = Object.freeze({
    price: 35,
    quality: 25,
    rating: 15,
    reliability: 15,
    distance: 10,
});

const QUALITY_SCORE = Object.freeze({
    STANDARD: 50,
    GOOD: 75,
    PREMIUM: 100,
});

const finiteNumber = (value) =>
    value !== null &&
    value !== undefined &&
    value !== "" &&
    Number.isFinite(Number(value));

const normalizeText = (value) =>
    String(value ?? "").trim().toLocaleLowerCase();

/**
 * Convert a quantity to KG.
 * Returns null when the quantity or unit is invalid.
 */
export function toKilograms(quantity, unit) {
    if (!finiteNumber(quantity) || Number(quantity) < 0) {
        return null;
    }

    const multiplier = UNIT_TO_KG[String(unit ?? "").toUpperCase()];

    if (!multiplier) {
        return null;
    }

    return Number(quantity) * multiplier;
}

/**
 * Convert a quantity between supported units.
 */
export function convertQuantity(quantity, fromUnit, toUnit) {
    const kilograms = toKilograms(quantity, fromUnit);
    const targetMultiplier = UNIT_TO_KG[String(toUnit ?? "").toUpperCase()];

    if (kilograms === null || !targetMultiplier) {
        return null;
    }

    return kilograms / targetMultiplier;
}

/**
 * Accept primitive IDs or populated Mongoose references.
 */
function idOf(value) {
    if (value && typeof value === "object") {
        if (value._id !== undefined) {
            return String(value._id);
        }

        if (value.id !== undefined) {
            return String(value.id);
        }
    }

    return value === undefined || value === null
        ? ""
        : String(value);
}

function bounded(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Convert a value into a 0–100 score relative to the supplied results.
 */
function minMaxScore(value, values, { higherIsBetter = true } = {}) {
    if (!finiteNumber(value)) {
        return null;
    }

    const valid = values.filter(finiteNumber).map(Number);

    if (!valid.length) {
        return null;
    }

    const min = Math.min(...valid);
    const max = Math.max(...valid);

    // Equal values are equally competitive.
    if (max === min) {
        return 100;
    }

    const score = ((Number(value) - min) / (max - min)) * 100;

    return bounded(higherIsBetter ? score : 100 - score);
}

/**
 * Merge custom weights with the defaults and validate them.
 */
function normalizeWeights(weights = {}) {
    const merged = { ...DEFAULT_WEIGHTS, ...weights };

    for (const key of Object.keys(merged)) {
        if (!finiteNumber(merged[key]) || Number(merged[key]) < 0) {
            throw new TypeError(
                `Weight "${key}" must be a non-negative number.`
            );
        }

        merged[key] = Number(merged[key]);
    }

    return merged;
}

/**
 * Score only factors that have real, usable data.
 * Missing ratings or distance are not automatically scored as zero.
 */
function weightedScore(factors, weights) {
    const available = Object.entries(factors).filter(([key, value]) =>
        value !== null &&
        value !== undefined &&
        finiteNumber(weights[key]) &&
        weights[key] > 0
    );

    const totalWeight = available.reduce(
        (sum, [key]) => sum + weights[key],
        0
    );

    if (!totalWeight) {
        return {
            score: null,
            usedFactors: [],
            availableWeightPercent: 0,
        };
    }

    const weightedTotal = available.reduce(
        (sum, [key, value]) => sum + Number(value) * weights[key],
        0
    );

    const allWeight = Object.values(weights).reduce(
        (sum, value) => sum + value,
        0
    );

    return {
        score: Math.round((weightedTotal / totalWeight) * 100) / 100,
        usedFactors: available.map(([key]) => key),
        availableWeightPercent: allWeight
            ? Math.round((totalWeight / allWeight) * 100)
            : 0,
    };
}

/**
 * Compare listing quality categories.
 * These categories are not independent quality certifications.
 */
function listingQualityScore(quality, preferredQuality) {
    const qualityValue =
        QUALITY_SCORE[String(quality ?? "").toUpperCase()];

    if (qualityValue === undefined) {
        return null;
    }

    if (!preferredQuality) {
        return qualityValue;
    }

    const preferredValue =
        QUALITY_SCORE[String(preferredQuality).toUpperCase()];

    if (preferredValue === undefined) {
        return null;
    }

    return qualityValue >= preferredValue
        ? 100
        : (qualityValue / preferredValue) * 100;
}

/**
 * Distance can only be scored if the caller supplies reliable distance data.
 * At 250 km or more, the score is zero.
 */
function distanceScore(distanceKm) {
    if (!finiteNumber(distanceKm) || Number(distanceKm) < 0) {
        return null;
    }

    return bounded(100 - (Number(distanceKm) / 250) * 100);
}

function sellerReliabilityScore(listing) {
    const explicit =
        listing?.sellerReliabilityScore ??
        listing?.farmerReliabilityScore ??
        listing?.reliabilityScore;

    if (!finiteNumber(explicit)) {
        return null;
    }

    return bounded(Number(explicit));
}

function ratingScore(listing) {
    const rating =
        listing?.sellerRating ??
        listing?.farmerRating ??
        listing?.rating;

    const reviewCount =
        listing?.sellerReviewCount ??
        listing?.farmerReviewCount ??
        listing?.reviewCount;

    if (
        !finiteNumber(rating) ||
        Number(rating) < 1 ||
        Number(rating) > 5
    ) {
        return null;
    }

    if (finiteNumber(reviewCount) && Number(reviewCount) <= 0) {
        return null;
    }

    return ((Number(rating) - 1) / 4) * 100;
}

function scoreReasons({
    factors,
    listing,
    requestedQuantity,
    requestedUnit,
    availableQuantity,
    availableUnit,
}) {
    const reasons = [];

    if (factors.price !== null) {
        reasons.push(
            "Competitive listed price compared with the eligible results."
        );
    }

    if (factors.quality !== null) {
        reasons.push(
            `Listing quality category: ${String(
                listing.quality ?? "not specified"
            ).toUpperCase()}. This is a listing value, not independent certification.`
        );
    }

    if (factors.rating !== null) {
        const rating =
            listing.sellerRating ??
            listing.farmerRating ??
            listing.rating;

        reasons.push(
            `Seller rating: ${Number(rating).toFixed(1)}/5 based on available review data.`
        );
    } else {
        reasons.push(
            "Insufficient seller review data to score rating."
        );
    }

    if (factors.reliability !== null) {
        reasons.push(
            "Seller reliability score supplied by the caller was included."
        );
    }

    if (factors.distance !== null) {
        reasons.push(
            `Distance: ${Number(listing.distanceKm).toFixed(1)} km, using supplied distance data.`
        );
    } else {
        reasons.push(
            "Distance was not scored because reliable distance data was not supplied."
        );
    }

    if (requestedQuantity !== null && availableQuantity !== null) {
        const requestedKg = toKilograms(
            requestedQuantity,
            requestedUnit
        );

        const availableKg = toKilograms(
            availableQuantity,
            availableUnit
        );

        if (
            requestedKg !== null &&
            availableKg !== null &&
            availableKg >= requestedKg
        ) {
            reasons.push(
                "Available quantity covers the requested quantity."
            );
        }
    }

    return reasons;
}

/**
 * Rank eligible active produce listings for a buyer.
 *
 * criteria:
 * {
 *   crop,
 *   quantity,
 *   unit,
 *   maxPricePerUnit?,
 *   preferredQuality?,
 *   location?
 * }
 *
 * Listing fields follow the existing Produce model, plus optional computed
 * fields: sellerRating, sellerReviewCount, sellerReliabilityScore, distanceKm.
 *
 * Listings with insufficient quantity, inactive status, wrong crop, or
 * unsupported units are excluded. Partial matches are not called complete.
 */
export function rankProduceListings(
    listings,
    criteria = {},
    options = {}
) {
    if (!Array.isArray(listings)) {
        throw new TypeError("listings must be an array.");
    }

    const weights = normalizeWeights(options.weights);
    const crop = normalizeText(criteria.crop);

    const requestedQuantity = finiteNumber(criteria.quantity)
        ? Number(criteria.quantity)
        : null;

    const requestedUnit = String(criteria.unit ?? "").toUpperCase();

    if (
        (requestedQuantity !== null && requestedQuantity <= 0) ||
        (requestedQuantity !== null && !UNIT_TO_KG[requestedUnit])
    ) {
        throw new TypeError(
            "Requested quantity must be positive and use KG, QUINTAL, or TON."
        );
    }

    if (
        finiteNumber(criteria.maxPricePerUnit) &&
        Number(criteria.maxPricePerUnit) < 0
    ) {
        throw new TypeError("maxPricePerUnit cannot be negative.");
    }

    const eligible = listings.filter((listing) => {
        if (
            !listing ||
            String(listing.status ?? "ACTIVE").toUpperCase() !== "ACTIVE"
        ) {
            return false;
        }

        if (crop && normalizeText(listing.crop) !== crop) {
            return false;
        }

        if (
            !finiteNumber(listing.expectedPrice) ||
            Number(listing.expectedPrice) < 0
        ) {
            return false;
        }

        if (
            !finiteNumber(listing.quantity) ||
            Number(listing.quantity) <= 0
        ) {
            return false;
        }

        const listingUnit = String(listing.unit ?? "").toUpperCase();

        if (!UNIT_TO_KG[listingUnit]) {
            return false;
        }

        if (requestedQuantity !== null) {
            const availableKg = toKilograms(
                listing.quantity,
                listingUnit
            );

            const requestedKg = toKilograms(
                requestedQuantity,
                requestedUnit
            );

            if (
                availableKg === null ||
                requestedKg === null ||
                availableKg < requestedKg
            ) {
                return false;
            }
        }

        if (finiteNumber(criteria.maxPricePerUnit)) {
            // The budget is interpreted in the requested unit, if supplied.
            const budgetUnit =
                requestedUnit || listingUnit;

            const priceInBudgetUnit =
                Number(listing.expectedPrice) *
                (
                    UNIT_TO_KG[budgetUnit] /
                    UNIT_TO_KG[listingUnit]
                );

            if (priceInBudgetUnit > Number(criteria.maxPricePerUnit)) {
                return false;
            }
        }

        if (
            criteria.location &&
            normalizeText(listing.location) !==
                normalizeText(criteria.location)
        ) {
            return false;
        }

        return true;
    });

    // Normalize prices so KG, QUINTAL and TON listings can be compared.
    const pricesPerKg = eligible.map((listing) =>
        Number(listing.expectedPrice) /
        UNIT_TO_KG[String(listing.unit).toUpperCase()]
    );

    const results = eligible.map((listing, index) => {
        const factors = {
            price: minMaxScore(
                pricesPerKg[index],
                pricesPerKg,
                { higherIsBetter: false }
            ),
            quality: listingQualityScore(
                listing.quality,
                criteria.preferredQuality
            ),
            rating: ratingScore(listing),
            reliability: sellerReliabilityScore(listing),
            distance: distanceScore(listing.distanceKm),
        };

        const scored = weightedScore(factors, weights);
        const availableQuantity = Number(listing.quantity);

        const quantityInRequestedUnit =
            requestedQuantity === null
                ? null
                : convertQuantity(
                    availableQuantity,
                    listing.unit,
                    requestedUnit
                );

        return {
            listingId: idOf(listing._id ?? listing.id),
            farmerId: idOf(listing.farmer),
            crop: listing.crop,
            quantity: availableQuantity,
            unit: String(listing.unit).toUpperCase(),
            expectedPrice: Number(listing.expectedPrice),
            location: listing.location,
            quality: listing.quality ?? "STANDARD",
            availableFrom: listing.availableFrom ?? null,
            status: listing.status ?? "ACTIVE",

            requestedQuantity,
            requestedUnit: requestedUnit || null,
            availableQuantityInRequestedUnit: quantityInRequestedUnit,

            quantityMatch:
                requestedQuantity === null
                    ? "NOT_REQUESTED"
                    : "COMPLETE",

            score: scored.score,
            scoreBreakdown: factors,
            usedFactors: scored.usedFactors,
            availableWeightPercent: scored.availableWeightPercent,

            confidence:
                scored.availableWeightPercent >= 80
                    ? "HIGH"
                    : scored.availableWeightPercent >= 55
                        ? "MEDIUM"
                        : "LOW",

            reasons: scoreReasons({
                factors,
                listing,
                requestedQuantity,
                requestedUnit,
                availableQuantity,
                availableUnit: listing.unit,
            }),

            limitations: [
                "Quality reflects the listing category and is not independently verified.",
            ],
        };
    });

    return results.sort((a, b) => {
        if (a.score === null && b.score !== null) return 1;
        if (b.score === null && a.score !== null) return -1;

        return (
            (b.score ?? -1) - (a.score ?? -1) ||
            a.expectedPrice - b.expectedPrice ||
            a.listingId.localeCompare(b.listingId)
        );
    });
}

/**
 * Rank buyer offers for a farmer.
 *
 * Offer shape is Deal-like, with optional:
 * buyerRating, buyerReviewCount, buyerReliabilityScore, distanceKm,
 * farmerBorneCosts.
 *
 * Missing cost data remains unknown; it is never assumed to be zero.
 */
export function rankBuyerOffers(offers, options = {}) {
    if (!Array.isArray(offers)) {
        throw new TypeError("offers must be an array.");
    }

    const weights = normalizeWeights(options.weights);

    const eligible = offers.filter((offer) =>
        offer &&
        ["PENDING", "ACCEPTED"].includes(
            String(offer.status ?? "PENDING").toUpperCase()
        ) &&
        finiteNumber(offer.offeredPrice) &&
        Number(offer.offeredPrice) >= 0 &&
        finiteNumber(offer.quantity) &&
        Number(offer.quantity) > 0 &&
        UNIT_TO_KG[String(offer.unit ?? "").toUpperCase()]
    );

    const prices = eligible.map((offer) => offer.offeredPrice);

    return eligible.map((offer) => {
        const factors = {
            price: minMaxScore(
                offer.offeredPrice,
                prices,
                { higherIsBetter: true }
            ),

            // The Deal model does not establish produce quality.
            quality: null,

            rating: (() => {
                const rating =
                    offer.buyerRating ?? offer.rating;

                const count =
                    offer.buyerReviewCount ?? offer.reviewCount;

                if (
                    !finiteNumber(rating) ||
                    Number(rating) < 1 ||
                    Number(rating) > 5
                ) {
                    return null;
                }

                if (finiteNumber(count) && Number(count) <= 0) {
                    return null;
                }

                return ((Number(rating) - 1) / 4) * 100;
            })(),

            reliability: (() => {
                const reliability =
                    offer.buyerReliabilityScore ??
                    offer.reliabilityScore;

                return finiteNumber(reliability)
                    ? bounded(Number(reliability))
                    : null;
            })(),

            distance:
                finiteNumber(offer.distanceKm) &&
                Number(offer.distanceKm) >= 0
                    ? distanceScore(offer.distanceKm)
                    : null,
        };

        const scored = weightedScore(factors, weights);

        const grossAmount = finiteNumber(offer.totalAmount)
            ? Number(offer.totalAmount)
            : Number(offer.quantity) * Number(offer.offeredPrice);

        const costsKnown =
            finiteNumber(offer.farmerBorneCosts) &&
            Number(offer.farmerBorneCosts) >= 0;

        const status =
            String(offer.status ?? "PENDING").toUpperCase();

        return {
            dealId: idOf(offer._id ?? offer.id),
            buyerId: idOf(offer.buyer),
            produceId: idOf(offer.produce),

            quantity: Number(offer.quantity),
            unit: String(offer.unit).toUpperCase(),
            offeredPrice: Number(offer.offeredPrice),

            grossDealValue: grossAmount,

            farmerBorneCosts: costsKnown
                ? Number(offer.farmerBorneCosts)
                : null,

            estimatedNetEarnings: costsKnown
                ? grossAmount - Number(offer.farmerBorneCosts)
                : null,

            netEarningsStatus: costsKnown
                ? "ESTIMATED_FROM_SUPPLIED_COSTS"
                : "UNKNOWN_COSTS_NOT_INCLUDED",

            status,

            score: scored.score,
            scoreBreakdown: factors,
            usedFactors: scored.usedFactors,
            availableWeightPercent: scored.availableWeightPercent,

            confidence:
                scored.availableWeightPercent >= 80
                    ? "HIGH"
                    : scored.availableWeightPercent >= 55
                        ? "MEDIUM"
                        : "LOW",

            reasons: [
                factors.price !== null
                    ? "Offer price compared with other eligible offers."
                    : "Offer-price comparison unavailable.",

                factors.rating !== null
                    ? `Buyer rating: ${Number(
                        offer.buyerRating ?? offer.rating
                    ).toFixed(1)}/5 based on available review data.`
                    : "Insufficient buyer review data to score rating.",

                factors.reliability !== null
                    ? "Buyer reliability score supplied by the caller was included."
                    : "No buyer reliability metric was supplied.",

                costsKnown
                    ? "Net earnings estimate subtracts only the supplied farmer-borne costs."
                    : "Net earnings cannot be calculated because farmer-borne costs are unknown.",

                status === "ACCEPTED"
                    ? "Deal is accepted; this does not prove payment or completion."
                    : "Offer is pending and has not been accepted.",
            ],

            limitations: [
                "Ranking is decision support, not a guarantee of payment or buyer performance.",
            ],
        };
    }).sort((a, b) => {
        if (a.score === null && b.score !== null) return 1;
        if (b.score === null && a.score !== null) return -1;

        return (
            (b.score ?? -1) - (a.score ?? -1) ||
            b.offeredPrice - a.offeredPrice ||
            a.dealId.localeCompare(b.dealId)
        );
    });
}
