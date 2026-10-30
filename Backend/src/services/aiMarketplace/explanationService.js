// Backend/src/services/aiMarketplace/explanationService.js

const FACTOR_LABELS = {
    price: "Price comparison",
    quality: "Listed produce quality",
    rating: "User ratings",
    buyerRating: "Buyer ratings",
    farmerRating: "Farmer ratings",
    reliability: "Reliability evidence",
    distance: "Location comparison",
};

const isPresent = (value) =>
    value !== undefined && value !== null && value !== "";

const toSentence = (value) => {
    if (typeof value !== "string") return null;

    const cleaned = value.trim();
    if (!cleaned) return null;

    return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
};

const uniqueStrings = (values) => [
    ...new Set(values.filter(Boolean)),
];

function getScoreReasons(scoreBreakdown = {}) {
    if (
        !scoreBreakdown ||
        typeof scoreBreakdown !== "object" ||
        Array.isArray(scoreBreakdown)
    ) {
        return [];
    }

    return Object.entries(scoreBreakdown)
        .filter(([, value]) =>
            typeof value === "number" &&
            Number.isFinite(value)
        )
        .filter(([factor]) =>
            Object.prototype.hasOwnProperty.call(
                FACTOR_LABELS,
                factor
            )
        )
        .map(([factor, value]) => ({
            factor,
            label: FACTOR_LABELS[factor],
            score: value,
        }));
}

function getConfidenceLabel(result) {
    const coverage = Number(result?.availableWeightPercent);

    if (Number.isFinite(coverage)) {
        if (coverage >= 80) {
            return "Strong data coverage";
        }

        if (coverage >= 50) {
            return "Partial data coverage";
        }

        return "Limited data coverage";
    }

    const confidence = String(result?.confidence ?? "")
        .toLowerCase();

    if (confidence === "high") {
        return "Strong data coverage";
    }

    if (confidence === "medium") {
        return "Partial data coverage";
    }

    if (confidence === "low") {
        return "Limited data coverage";
    }

    return "Data coverage not specified";
}

function getCaveats(result) {
    const limitations = Array.isArray(result?.limitations)
        ? result.limitations
        : [];

    const caveats = limitations.map(toSentence);

    if (!isPresent(result?.buyerRating) &&
        !isPresent(result?.farmerRating)) {
        // Do not assume that every ranking result contains
        // a rating field. The ranking engine may use a
        // different shape for buyer and farmer results.
    }

    return uniqueStrings(caveats);
}

/**
 * Explain a buyer-facing produce recommendation.
 * Does not change the original score or ranking.
 */
export function explainBuyerRecommendation(result = {}) {
    const reasons = uniqueStrings(
        (Array.isArray(result.reasons) ? result.reasons : [])
            .map(toSentence)
    );

    const crop = isPresent(result.crop)
        ? String(result.crop)
        : "This produce listing";

    const quality = isPresent(result.quality)
        ? String(result.quality).toLowerCase()
        : null;

    const summaryParts = [];

    if (quality) {
        summaryParts.push(
            `The listing is marked as ${quality} quality`
        );
    }

    if (isPresent(result.expectedPrice)) {
        summaryParts.push(
            `the listed expected price is ${result.expectedPrice} per ${String(
                result.unit ?? "unit"
            ).toUpperCase()}`
        );
    }

    const summary = summaryParts.length
        ? `${crop}: ${summaryParts.join("; ")}.`
        : `${crop} is ranked using the available listing and comparison data.`;

    const caveats = getCaveats(result);

    if (!quality) {
        caveats.push(
            "A quality grade was not available in the recommendation data."
        );
    } else {
        caveats.push(
            "The quality grade is listing information, not an independent inspection."
        );
    }

    if (!reasons.length) {
        caveats.push(
            "No detailed ranking reasons were supplied by the ranking engine."
        );
    }

    return {
        title: "Why this produce is recommended",
        summary,
        reasons,
        scoreEvidence: getScoreReasons(result.scoreBreakdown),
        caveats: uniqueStrings(caveats),
        confidenceLabel: getConfidenceLabel(result),
        method: "RULE_BASED",
    };
}

/**
 * Explain a farmer-facing buyer offer.
 * Does not imply that an offer has been paid or completed.
 */
export function explainFarmerRecommendation(result = {}) {
    const reasons = uniqueStrings(
        (Array.isArray(result.reasons) ? result.reasons : [])
            .map(toSentence)
    );

    const amount = Number(
        result.grossDealValue ?? result.totalAmount
    );

    const hasValidAmount =
        Number.isFinite(amount) && amount >= 0;

    const crop = isPresent(result?.produce?.crop)
        ? String(result.produce.crop)
        : isPresent(result.crop)
            ? String(result.crop)
            : "your produce";

    const summaryParts = [];

    if (hasValidAmount) {
        summaryParts.push(
            `the recorded gross deal value is ₹${amount.toLocaleString("en-IN")}`
        );
    }

    if (isPresent(result.offeredPrice)) {
        summaryParts.push(
            `the buyer's offered price is ₹${result.offeredPrice} per ${String(
                result.unit ?? "unit"
            ).toUpperCase()}`
        );
    }

    const summary = summaryParts.length
        ? `This offer for ${crop} has ${summaryParts.join("; ")}.`
        : `This offer for ${crop} is ranked using the available offer and buyer evidence.`;

    const caveats = getCaveats(result);

    const costsKnown =
        result.farmerBorneCosts !== null &&
        result.farmerBorneCosts !== undefined;

    if (!costsKnown) {
        caveats.push(
            "Farmer-borne costs are unknown, so net earnings cannot be confirmed."
        );
    }

    if (String(result.status ?? "").toUpperCase() === "PENDING") {
        caveats.push(
            "This is a pending offer; it has not been accepted."
        );
    } else if (
        String(result.status ?? "").toUpperCase() === "ACCEPTED"
    ) {
        caveats.push(
            "Acceptance does not prove that payment has succeeded or delivery is complete."
        );
    }

    if (!reasons.length) {
        caveats.push(
            "No detailed ranking reasons were supplied by the ranking engine."
        );
    }

    return {
        title: "Why this buyer offer is recommended",
        summary,
        reasons,
        scoreEvidence: getScoreReasons(result.scoreBreakdown),
        caveats: uniqueStrings(caveats),
        confidenceLabel: getConfidenceLabel(result),
        method: "RULE_BASED",
    };
}