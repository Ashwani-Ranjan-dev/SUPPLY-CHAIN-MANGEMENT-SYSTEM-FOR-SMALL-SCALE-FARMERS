import {
    explainBuyerRecommendation,
    explainFarmerRecommendation,
} from "./explanationService.js";

import {
    generateAiExplanation,
} from "./aiExplanationProvider.js";

const MAX_TITLE_LENGTH = 120;
const MAX_SUMMARY_LENGTH = 500;
const MAX_REASON_LENGTH = 240;
const MAX_REASONS = 5;

/**
 * Remove control characters, trim whitespace and limit text length.
 */
function sanitizeText(value, maxLength) {
    if (typeof value !== "string") {
        return null;
    }

    const cleaned = value
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!cleaned) {
        return null;
    }

    return cleaned.slice(0, maxLength);
}

/**
 * Accept only the fields that our UI expects.
 *
 * AI must not provide ranking scores, score breakdowns,
 * confidence labels or factual caveats.
 */
export function validateAiExplanation(output) {
    if (
        !output ||
        typeof output !== "object" ||
        Array.isArray(output)
    ) {
        return null;
    }

    const title = sanitizeText(
        output.title,
        MAX_TITLE_LENGTH
    );

    const summary = sanitizeText(
        output.summary,
        MAX_SUMMARY_LENGTH
    );

    if (!title || !summary || !Array.isArray(output.reasons)) {
        return null;
    }

    if (
        output.reasons.length === 0 ||
        output.reasons.length > MAX_REASONS
    ) {
        return null;
    }

    const reasons = output.reasons.map((reason) =>
        sanitizeText(reason, MAX_REASON_LENGTH)
    );

    if (reasons.some((reason) => reason === null)) {
        return null;
    }

    return {
        title,
        summary,
        reasons,
    };
}

/**
 * Build a small, allowlisted evidence object for a future AI provider.
 * Do not send phone numbers, email addresses, or private account data.
 */
export function buildSafeEvidence(audience, result = {}) {
    const common = {
        reasons: Array.isArray(result.reasons)
            ? result.reasons
                .filter((item) => typeof item === "string")
                .slice(0, MAX_REASONS)
            : [],
        scoreBreakdown:
            result.scoreBreakdown &&
            typeof result.scoreBreakdown === "object" &&
            !Array.isArray(result.scoreBreakdown)
                ? result.scoreBreakdown
                : undefined,
        limitations: Array.isArray(result.limitations)
            ? result.limitations
                .filter((item) => typeof item === "string")
                .slice(0, MAX_REASONS)
            : [],
        availableWeightPercent:
            Number.isFinite(result.availableWeightPercent)
                ? result.availableWeightPercent
                : undefined,
        confidence:
            typeof result.confidence === "string" ||
            Number.isFinite(result.confidence)
                ? result.confidence
                : undefined,
    };

    if (audience === "buyer") {
        return {
            ...common,
            crop: result.crop,
            quality: result.quality,
            expectedPrice: result.expectedPrice,
            unit: result.unit,
        };
    }

    const produce = result.produce || {};

    return {
        ...common,
        crop: produce.crop ?? result.crop,
        quality: produce.quality ?? result.quality,
        quantity: result.quantity,
        unit: result.unit,
        offeredPrice: result.offeredPrice,
        grossDealValue:
            result.grossDealValue ?? result.totalAmount,
        dealStatus: result.status,
    };
}

/**
 * Generate an explanation without changing the recommendation itself.
 *
 * aiGenerator is injectable so we can test success and failure without
 * contacting an external provider.
 */
export async function buildExplanationWithFallback({
    audience,
    result,
    aiGenerator = generateAiExplanation,
}) {
    const explainRuleBased =
        audience === "buyer"
            ? explainBuyerRecommendation
            : audience === "farmer"
                ? explainFarmerRecommendation
                : null;

    if (!explainRuleBased) {
        throw new Error(
            'Invalid audience. Expected "buyer" or "farmer".'
        );
    }

    const fallback = explainRuleBased(result);

    // The fallback is always available.
    if (process.env.AI_EXPLANATIONS_ENABLED !== "true") {
        return fallback;
    }

    try {
        const aiOutput = await aiGenerator({
            audience,
            evidence: buildSafeEvidence(audience, result),
        });

        const validated = validateAiExplanation(aiOutput);

        // Disabled, unavailable or invalid AI output:
        // retain the rule-based explanation.
        if (!validated) {
            return fallback;
        }

        return {
            ...fallback,

            // Only narrative fields are allowed to change.
            title: validated.title,
            summary: validated.summary,
            reasons: validated.reasons,

            method: "AI_ASSISTED",
        };
    } catch {
        // Provider errors must not break the recommendation API.
        return fallback;
    }
}

export async function explainBuyerRecommendationWithFallback(result) {
    return buildExplanationWithFallback({
        audience: "buyer",
        result,
    });
}

export async function explainFarmerRecommendationWithFallback(result) {
    return buildExplanationWithFallback({
        audience: "farmer",
        result,
    });
}