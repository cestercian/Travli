import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

let cachedClient: Groq | null = null;

export function getGroqClient() {
    if (!cachedClient) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("Missing GROQ_API_KEY environment variable");
        }
        cachedClient = new Groq({ apiKey });
    }
    return cachedClient;
}

export async function runTravelCompletion(messages: ChatCompletionMessageParam[]) {
    const client = getGroqClient();
    const response = await client.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        temperature: 0.4,
        max_completion_tokens: 600,
        messages,
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) {
        throw new Error("EMPTY_COMPLETION");
    }
    return text;
}
