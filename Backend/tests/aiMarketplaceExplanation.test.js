import test from "node:test";
import assert from "node:assert/strict";

import {
    explainBuyerRecommendation,
    explainFarmerRecommendation,
} from "../src/services/aiMarketplace/explanationService.js";

test("buyer explanation uses supplied ranking reasons", () => {
    const result = explainBuyerRecommendation({
        crop: "Tomato",
        quality: "GOOD",
        expectedPrice: 20,
        unit: "KG",
        reasons: ["The price compares favorably with eligible listings."],
        scoreBreakdown: {
            price: 90,
            quality: 75,
        },
        availableWeightPercent: 80,
        limitations: [],
    });

    assert.equal(result.method, "RULE_BASED");
    assert.match(result.summary, /Tomato/);
    assert.equal(result.reasons.length, 1);
    assert.equal(result.scoreEvidence.length, 2);
    assert.ok(Array.isArray(result.caveats));
});

test("buyer explanation flags unverified quality", () => {
    const result = explainBuyerRecommendation({
        crop: "Onion",
        reasons: [],
    });

    assert.ok(
        result.caveats.some((item) =>
            item.includes("quality grade was not available")
        )
    );

    assert.ok(
        result.caveats.some((item) =>
            item.includes("No detailed ranking reasons")
        )
    );
});

test("farmer explanation does not claim unknown net earnings", () => {
    const result = explainFarmerRecommendation({
        status: "PENDING",
        offeredPrice: 25,
        quantity: 100,
        unit: "KG",
        grossDealValue: 2500,
        farmerBorneCosts: null,
        produce: { crop: "Tomato" },
        reasons: ["This offer has a competitive normalized price."],
        limitations: [],
    });

    assert.equal(result.method, "RULE_BASED");
    assert.match(result.summary, /Tomato/);

    assert.ok(
        result.caveats.some((item) =>
            item.includes("net earnings cannot be confirmed")
        )
    );

    assert.ok(
        result.caveats.some((item) =>
            item.includes("has not been accepted")
        )
    );
});

test("farmer explanation warns that acceptance does not prove payment", () => {
    const result = explainFarmerRecommendation({
        status: "ACCEPTED",
        offeredPrice: 30,
        unit: "KG",
        totalAmount: 3000,
        farmerBorneCosts: null,
        reasons: [],
    });

    assert.ok(
        result.caveats.some((item) =>
            item.includes("payment has succeeded")
        )
    );
});

test("explanation handles missing or invalid score breakdown safely", () => {
    const result = explainBuyerRecommendation({
        crop: "Potato",
        scoreBreakdown: null,
        reasons: null,
        limitations: null,
    });

    assert.deepEqual(result.scoreEvidence, []);
    assert.deepEqual(result.reasons, []);
    assert.equal(result.method, "RULE_BASED");
});