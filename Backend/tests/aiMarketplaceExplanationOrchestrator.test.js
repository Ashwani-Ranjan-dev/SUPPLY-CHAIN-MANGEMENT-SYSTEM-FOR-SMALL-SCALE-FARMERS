
import test from "node:test";
import assert from "node:assert/strict";

import {
    buildExplanationWithFallback,
    buildSafeEvidence,
    validateAiExplanation,
} from "../src/services/aiMarketplace/explanationOrchestrator.js";

import {
    explainBuyerRecommendation,
} from "../src/services/aiMarketplace/explanationService.js";

function createBuyerResult() {
    return {
        crop: "Tomato",
        quality: "PREMIUM",
        expectedPrice: 20,
        unit: "KG",
        rank: 1,
        score: 88,
        scoreBreakdown: {
            price: 32,
            quality: 24,
        },
        reasons: [
            "The listing has a competitive price.",
            "The produce is marked premium quality.",
        ],
        limitations: [],
        availableWeightPercent: 90,
    };
}

function createValidAiOutput() {
    return {
        title: "A competitive tomato listing",
        summary:
            "This listing has a competitive listed price and premium quality.",
        reasons: [
            "The listed price is competitive.",
            "The listing reports premium quality.",
        ],
    };
}

async function withAiFlag(value, callback) {
    const previousValue = process.env.AI_EXPLANATIONS_ENABLED;

    try {
        if (value === undefined) {
            delete process.env.AI_EXPLANATIONS_ENABLED;
        } else {
            process.env.AI_EXPLANATIONS_ENABLED = value;
        }

        await callback();
    } finally {
        if (previousValue === undefined) {
            delete process.env.AI_EXPLANATIONS_ENABLED;
        } else {
            process.env.AI_EXPLANATIONS_ENABLED = previousValue;
        }
    }
}

test("AI disabled: returns the rule-based explanation", async () => {
    await withAiFlag("false", async () => {
        let generatorCalled = false;

        const explanation = await buildExplanationWithFallback({
            audience: "buyer",
            result: createBuyerResult(),
            aiGenerator: async () => {
                generatorCalled = true;
                return createValidAiOutput();
            },
        });

        assert.equal(generatorCalled, false);
        assert.equal(explanation.method, "RULE_BASED");
        assert.ok(explanation.title);
        assert.ok(explanation.summary);
    });
});

test(
    "valid AI output: uses AI narrative and preserves rule-based evidence",
    async () => {
        await withAiFlag("true", async () => {
            const result = createBuyerResult();

            const explanation = await buildExplanationWithFallback({
                audience: "buyer",
                result,
                aiGenerator: async () => createValidAiOutput(),
            });

            assert.equal(explanation.method, "AI_ASSISTED");

            assert.equal(
                explanation.title,
                "A competitive tomato listing"
            );

            // Compare AI-assisted evidence against the independent
            // rule-based explanation for the same recommendation.
            const baseline = explainBuyerRecommendation(result);

            assert.deepEqual(
                explanation.scoreEvidence,
                baseline.scoreEvidence
            );

            assert.deepEqual(
                explanation.caveats,
                baseline.caveats
            );

            assert.equal(
                explanation.confidenceLabel,
                baseline.confidenceLabel
            );
        });
    }
);

test(
    "invalid AI output: falls back to rule-based explanation",
    async () => {
        await withAiFlag("true", async () => {
            const explanation = await buildExplanationWithFallback({
                audience: "buyer",
                result: createBuyerResult(),
                aiGenerator: async () => ({
                    title: "Invalid response",
                    summary: "Missing reasons array",
                }),
            });

            assert.equal(explanation.method, "RULE_BASED");
        });
    }
);

test(
    "provider failure: falls back instead of failing the request",
    async () => {
        await withAiFlag("true", async () => {
            const explanation = await buildExplanationWithFallback({
                audience: "buyer",
                result: createBuyerResult(),
                aiGenerator: async () => {
                    throw new Error("Provider unavailable");
                },
            });

            assert.equal(explanation.method, "RULE_BASED");
            assert.ok(explanation.summary);
        });
    }
);

test(
    "AI output validation rejects missing or malformed fields",
    () => {
        assert.equal(validateAiExplanation(null), null);

        assert.equal(
            validateAiExplanation({
                title: "A title",
                summary: "A summary",
                reasons: [],
            }),
            null
        );

        assert.equal(
            validateAiExplanation({
                title: "A title",
                summary: "A summary",
                reasons: ["Valid reason", 123],
            }),
            null
        );
    }
);

test("AI output validation limits text length", () => {
    const result = validateAiExplanation({
        title: "T".repeat(500),
        summary: "S".repeat(1000),
        reasons: ["R".repeat(500)],
    });

    assert.ok(result);
    assert.equal(result.title.length, 120);
    assert.equal(result.summary.length, 500);
    assert.equal(result.reasons[0].length, 240);
});

test("safe evidence excludes contact and account details", () => {
    const evidence = buildSafeEvidence("farmer", {
        crop: "Tomato",
        offeredPrice: 25,
        buyerPhone: "9999999999",
        buyerEmail: "private@example.com",
        buyerName: "Private Buyer",
        reasons: ["A pending offer is available."],
    });

    assert.equal(evidence.crop, "Tomato");
    assert.equal(evidence.offeredPrice, 25);
    assert.equal("buyerPhone" in evidence, false);
    assert.equal("buyerEmail" in evidence, false);
    assert.equal("buyerName" in evidence, false);
});

test(
    "explanation generation does not mutate recommendation ranking",
    async () => {
        await withAiFlag("true", async () => {
            const result = createBuyerResult();

            const originalRank = result.rank;
            const originalScore = result.score;
            const originalBreakdown = structuredClone(
                result.scoreBreakdown
            );

            await buildExplanationWithFallback({
                audience: "buyer",
                result,
                aiGenerator: async () => createValidAiOutput(),
            });

            assert.equal(result.rank, originalRank);
            assert.equal(result.score, originalScore);

            assert.deepEqual(
                result.scoreBreakdown,
                originalBreakdown
            );
        });
    }
);
