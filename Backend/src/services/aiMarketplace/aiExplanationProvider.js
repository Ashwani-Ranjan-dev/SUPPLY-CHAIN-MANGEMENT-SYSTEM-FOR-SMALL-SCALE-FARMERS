/**
 * KrishiConnect AI Explanation Provider
 *
 * Phase 5.2:
 * - Defines the future provider interface.
 * - Does not call an external AI service yet.
 * - Returns null until a real provider is configured.
 *
 * The orchestrator will then use the rule-based fallback.
 */
export async function generateAiExplanation({ audience, evidence }) {
    if (process.env.AI_EXPLANATIONS_ENABLED !== "true") {
        return null;
    }

    // The actual AI provider will be integrated in a later phase.
    // Do not pretend that an AI response was generated.
    return null;
}