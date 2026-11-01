
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.AI_MODEL;

if (!apiKey || !model) {
    throw new Error("Gemini configuration is missing.");
}

const ai = new GoogleGenAI({ apiKey });

async function testGemini() {
    try {
        console.log("Testing Gemini...");
        console.log("Model:", model);

        const response = await ai.models.generateContent({
            model,
            contents: "Explain KrishiConnect in two sentences.",
        });

        console.log("\nSUCCESS: Gemini is connected!");
        console.log(response.text);
    } catch (error) {
        console.error("\nGEMINI CONNECTION FAILED");
        console.error("Status:", error.status);
        console.error("Message:", error.message);
    }
}

testGemini();
