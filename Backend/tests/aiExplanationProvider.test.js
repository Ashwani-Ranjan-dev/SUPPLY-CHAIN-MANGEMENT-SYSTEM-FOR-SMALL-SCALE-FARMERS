import test, {
    beforeEach,
    afterEach,
} from "node:test";

import assert from "node:assert/strict";

import {
    generateAiExplanation,
} from "../src/services/aiMarketplace/aiExplanationProvider.js";

const originalEnv = {};

const TEST_ENV_KEYS = [
    "AI_EXPLANATIONS_ENABLED",
    "AI_PROVIDER",
    "AI_MODEL",
    "GEMINI_API_KEY",
];

beforeEach(() => {
    for (const key of TEST_ENV_KEYS) {
        originalEnv[key] = process.env[key];
    }

    process.env.AI_EXPLANATIONS_ENABLED = "true";
    process.env.AI_PROVIDER = "gemini";
    process.env.AI_MODEL = "gemini-2.5-flash";
    process.env.GEMINI_API_KEY = "test-key";
});

afterEach(() => {
    for (const key of TEST_ENV_KEYS) {
        if (originalEnv[key] === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = originalEnv[key];
        }
    }
});

function createMockClient(responseText) {
    let capturedRequest = null;

    const client = {
        models: {
            generateContent: async (request) => {
                capturedRequest = request;

                return {
                    text: responseText,
                };
            },
        },
    };

    return {
        client,
        getCapturedRequest: () => capturedRequest,
    };
}

const sampleEvidence = {
    crop: "Potato",
    quantity: 5,
    unit: "QUINTAL",
    offeredPrice: 2200,
    grossDealValue: 11000,
    dealStatus: "PENDING",
    reasons: [
        "Offer price compared with other eligible offers.",
        "Buyer rating: 4.5/5 based on available review data.",
    ],
    limitations: [
        "Net earnings cannot be calculated because farmer-borne costs are unknown.",
    ],
};

test("AI disabled: provider returns null without calling Gemini", async () => {
    process.env.AI_EXPLANATIONS_ENABLED = "false";

    let called = false;

    const fakeClient = {
        models: {
            generateContent: async () => {
                called = true;
                return { text: "{}" };
            },
        },
    };

    const result = await generateAiExplanation({
        audience: "farmer",
        evidence: sampleEvidence,
        client: fakeClient,
    });

    assert.equal(result, null);
    assert.equal(called, false);
});

test("unsupported provider: returns null", async () => {
    process.env.AI_PROVIDER = "openai";

    const result = await generateAiExplanation({
        audience: "farmer",
        evidence: sampleEvidence,
    });

    assert.equal(result, null);
});

test("missing API key: returns null without calling Gemini", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await generateAiExplanation({
        audience: "farmer",
        evidence: sampleEvidence,
    });

    assert.equal(result, null);
});

test("valid Gemini JSON: returns the explanation", async () => {
    const expected = {
        title: "A competitive buyer offer",
        summary:
            "The offer has a recorded gross value of ₹11,000.",
        reasons: [
            "The offered price is competitive.",
            "The buyer has a recorded rating of 4.5/5.",
        ],
    };

    const mock = createMockClient(
        JSON.stringify(expected)
    );

    const result = await generateAiExplanation({
        audience: "farmer",
        evidence: sampleEvidence,
        client: mock.client,
    });

    assert.deepEqual(result, expected);

    const request = mock.getCapturedRequest();

    assert.equal(
        request.model,
        "gemini-2.5-flash"
    );

    assert.equal(
        request.config.responseMimeType,
        "application/json"
    );

    assert.equal(
        request.config.temperature,
        0.2
    );

    assert.ok(request.config.responseJsonSchema);
});

test("invalid Gemini JSON: returns null", async () => {
    const mock = createMockClient(
        "This is not valid JSON"
    );

    const result = await generateAiExplanation({
        audience: "farmer",
        evidence: sampleEvidence,
        client: mock.client,
    });

    assert.equal(result, null);
});

test("invalid audience: returns null without calling Gemini", async () => {
    let called = false;

    const fakeClient = {
        models: {
            generateContent: async () => {
                called = true;
                return { text: "{}" };
            },
        },
    };

    const result = await generateAiExplanation({
        audience: "admin",
        evidence: sampleEvidence,
        client: fakeClient,
    });

    assert.equal(result, null);
    assert.equal(called, false);
});

test("Gemini timeout: rejects so orchestrator can use fallback", async () => {
    const fakeClient = {
        models: {
            generateContent: () => new Promise(() => {}),
        },
    };

    await assert.rejects(
        generateAiExplanation({
            audience: "farmer",
            evidence: sampleEvidence,
            client: fakeClient,
            timeoutMs: 10,
        }),
        /Gemini request timed out/
    );
});