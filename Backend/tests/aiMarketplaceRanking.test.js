
import test from "node:test";
import assert from "node:assert/strict";

import {
    convertQuantity,
    rankBuyerOffers,
    rankProduceListings,
    toKilograms,
} from "../src/services/aiMarketplace/rankingEngine.js";

test("quantity conversion supports KG, QUINTAL and TON", () => {
    assert.equal(toKilograms(2, "TON"), 2000);
    assert.equal(convertQuantity(2, "QUINTAL", "KG"), 200);
    assert.equal(convertQuantity(1000, "KG", "TON"), 1);
    assert.equal(convertQuantity(2, "BAG", "KG"), null);
});

test("buyer ranking excludes inactive, wrong-crop and insufficient-quantity listings", () => {
    const ranked = rankProduceListings(
        [
            {
                _id: "a",
                crop: "Tomato",
                quantity: 2,
                unit: "QUINTAL",
                expectedPrice: 1500,
                location: "Puducherry",
                quality: "GOOD",
                status: "ACTIVE",
            },
            {
                _id: "b",
                crop: "Tomato",
                quantity: 50,
                unit: "KG",
                expectedPrice: 10,
                location: "Puducherry",
                quality: "PREMIUM",
                status: "ACTIVE",
            },
            {
                _id: "c",
                crop: "Onion",
                quantity: 10,
                unit: "QUINTAL",
                expectedPrice: 900,
                location: "Puducherry",
                quality: "GOOD",
                status: "ACTIVE",
            },
            {
                _id: "d",
                crop: "Tomato",
                quantity: 10,
                unit: "QUINTAL",
                expectedPrice: 900,
                location: "Puducherry",
                quality: "GOOD",
                status: "SOLD",
            },
        ],
        {
            crop: "tomato",
            quantity: 100,
            unit: "KG",
        }
    );

    assert.deepEqual(
        ranked.map((item) => item.listingId),
        ["a"]
    );

    assert.equal(ranked[0].quantityMatch, "COMPLETE");
    assert.equal(
        ranked[0].availableQuantityInRequestedUnit,
        200
    );
});

test("missing ratings are not treated as zero and factors are renormalized", () => {
    const [result] = rankProduceListings(
        [
            {
                _id: "a",
                crop: "Rice",
                quantity: 5,
                unit: "QUINTAL",
                expectedPrice: 3000,
                location: "A",
                quality: "GOOD",
                status: "ACTIVE",
            },
        ],
        { crop: "Rice" }
    );

    assert.equal(result.scoreBreakdown.rating, null);
    assert.ok(result.usedFactors.includes("price"));
    assert.ok(!result.usedFactors.includes("rating"));

    assert.ok(
        result.reasons.some((reason) =>
            reason.includes("Insufficient seller review data")
        )
    );
});

test("buyer ranking rejects invalid requested units and weights", () => {
    assert.throws(
        () => rankProduceListings([], {
            quantity: 2,
            unit: "BAG",
        }),
        /KG, QUINTAL, or TON/
    );

    assert.throws(
        () => rankProduceListings(
            [],
            {},
            { weights: { price: -1 } }
        ),
        /non-negative number/
    );
});

test("farmer offer ranking does not assume unknown costs are zero", () => {
    const [result] = rankBuyerOffers([
        {
            _id: "deal-1",
            buyer: "buyer-1",
            quantity: 2,
            unit: "QUINTAL",
            offeredPrice: 2500,
            totalAmount: 5000,
            status: "PENDING",
        },
    ]);

    assert.equal(result.grossDealValue, 5000);
    assert.equal(result.farmerBorneCosts, null);
    assert.equal(result.estimatedNetEarnings, null);

    assert.equal(
        result.netEarningsStatus,
        "UNKNOWN_COSTS_NOT_INCLUDED"
    );

    assert.ok(
        result.reasons.some((reason) =>
            reason.includes("has not been accepted")
        )
    );
});

test("farmer offer ranking subtracts only explicitly supplied costs", () => {
    const [result] = rankBuyerOffers([
        {
            _id: "deal-2",
            quantity: 3,
            unit: "QUINTAL",
            offeredPrice: 2000,
            totalAmount: 6000,
            farmerBorneCosts: 700,
            status: "ACCEPTED",
        },
    ]);

    assert.equal(result.estimatedNetEarnings, 5300);

    assert.ok(
        result.reasons.some((reason) =>
            reason.includes("does not prove payment or completion")
        )
    );
});
