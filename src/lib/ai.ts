"use server";

import { getGroqClient } from "./groq";
import { geocodeLocation, WeatherSummary } from "./weather";
import { SupportedLanguage } from "./i18n";

export interface TravelIntent {
    destination: string;
    date: string; // ISO date or "tomorrow", "today"
}

export interface Activity {
    title: string;
    description: string;
    locationName: string;
    coordinates?: { lat: number; lng: number };
}

export interface ItinerarySuggestion {
    morning: Activity;
    afternoon: Activity;
    evening: Activity;
    meal: string;
    item: string;
    transport: string;
    outfit: string;
}

export async function parseTravelIntent(userQuery: string, language: SupportedLanguage): Promise<TravelIntent> {
    const client = getGroqClient();

    const systemPrompt = language === "ja"
        ? `あなたは旅行アシスタントです。ユーザーのクエリから目的地と日付を抽出してください。
       JSONオブジェクトのみを返してください。キー："destination"（文字列）と"date"（文字列）。
       目的地は必ず**英語**で返してください（例："Tokyo", "Osaka"）。
       日付は可能な限りISO形式（YYYY-MM-DD）に変換するか、相対的な言葉（"tomorrow", "next sunday"）をそのまま返してください。
       日付が指定されていない場合は "tomorrow" をデフォルトとしてください。
       例：「明日の東京のプラン」→ {"destination": "Tokyo", "date": "tomorrow"}
       例：「大阪に行きたい」→ {"destination": "Osaka", "date": "tomorrow"}`
        : `You are a travel assistant. Extract the destination and date from the user's query. 
       Return ONLY a JSON object with keys "destination" (string) and "date" (string). 
       For destination, extract the CITY NAME only and return it in **ENGLISH**.
       For date, try to convert to ISO format (YYYY-MM-DD) if possible, or keep relative terms like "tomorrow", "next sunday".
       If date is not specified, default to "tomorrow".
       Example: "Plan for Tokyo tomorrow" -> {"destination": "Tokyo", "date": "tomorrow"}
       Example: "I want to go to Osaka" -> {"destination": "Osaka", "date": "tomorrow"}`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery }
    ];

    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages as any,
        response_format: { type: "json_object" },
        temperature: 0.1,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Failed to parse intent");

    console.log(`[AI] Raw Intent Response: ${text}`);
    try {
        const parsed = JSON.parse(text) as TravelIntent;
        console.log(`[AI] Parsed Intent:`, parsed);
        return parsed;
    } catch (e) {
        throw new Error("Invalid JSON response from AI");
    }
}

export async function generateItinerary(
    destination: string,
    weather: WeatherSummary,
    language: SupportedLanguage
): Promise<ItinerarySuggestion> {
    const client = getGroqClient();

    // Find the relevant day's forecast (simplified logic: just take the first one or matching date if we had date logic here)
    // Since we are fetching 5 days but planning for 1, let's assume the first day of forecast is the target for now
    // or we could pass the target date to this function. For now, let's use the first forecast day as the "target day".
    const targetDay = weather.forecast[0];

    const weatherContext = `
    Location: ${weather.locationLabel}
    Date: ${targetDay.date}
    Temp: High ${targetDay.maxTemp}°C / Low ${targetDay.minTemp}°C
    Condition: ${targetDay.description}
    Precipitation Chance: ${targetDay.precipitationChance}%
  `;

    const systemPrompt = language === "ja"
        ? `あなたはプロの旅行プランナーです。
       目的地と特定の日の天気予報に基づいて、1日の旅行プランを作成してください。
       以下のキーを持つJSONオブジェクトのみを返してください：
       - "morning": { "title": "活動名", "description": "詳細な説明", "locationName": "場所の名前(英語で)" }
       - "afternoon": { "title": "活動名", "description": "詳細な説明", "locationName": "場所の名前(英語で)" }
       - "evening": { "title": "活動名", "description": "詳細な説明", "locationName": "場所の名前(英語で)" }
       - "meal": おすすめの食事スポット（1つだけ）。
       - "item": 天気に合わせた必須アイテム（例：雨なら傘、晴れなら日焼け止め）。
       - "transport": その都市での移動のヒント（1行）。
       - "outfit": 天気と活動に合わせた具体的な服装のアドバイス。
       
       重要: "locationName" はGeocodingのために必ず英語の固有名詞（例: "Senso-ji", "Tokyo Tower"）にしてください。
       トーンは親しみやすく、簡潔に。`
        : `You are a professional travel planner.
       Based on the destination and the weather forecast for a specific day, create a one-day itinerary.
       Return ONLY a JSON object with exactly these keys:
       - "morning": { "title": "Activity Title", "description": "Details", "locationName": "Specific Place Name" }
       - "afternoon": { "title": "Activity Title", "description": "Details", "locationName": "Specific Place Name" }
       - "evening": { "title": "Activity Title", "description": "Details", "locationName": "Specific Place Name" }
       - "meal": One specific recommended dining spot or dish.
       - "item": One essential item to pack based on weather (e.g., Umbrella if rain, Sunscreen if sunny).
       - "transport": One specific tip for getting around this city.
       - "outfit": Detailed outfit recommendation based on weather and activities.
       
       IMPORTANT: "locationName" must be a specific, geocodable place name in English (e.g., "Senso-ji", "Tokyo Tower").
       Keep descriptions concise and engaging.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Destination: ${destination}\nWeather Context: ${weatherContext}` }
    ];

    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages as any,
        response_format: { type: "json_object" },
        temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Failed to generate itinerary");

    try {
        const suggestion = JSON.parse(text) as ItinerarySuggestion;

        // Geocode locations
        const geocodeActivity = async (activity: Activity) => {
            if (activity.locationName) {
                // Append destination city to clarify (e.g. "Senso-ji, Tokyo")
                const query = `${activity.locationName}, ${destination}`;
                const result = await geocodeLocation(query);
                if (result) {
                    activity.coordinates = { lat: result.latitude, lng: result.longitude };
                }
            }
        };

        await Promise.all([
            geocodeActivity(suggestion.morning),
            geocodeActivity(suggestion.afternoon),
            geocodeActivity(suggestion.evening),
        ]);

        return suggestion;
    } catch (e) {
        console.error("Error parsing/geocoding itinerary:", e);
        throw new Error("Invalid JSON response for itinerary");
    }
}

// Transcribe audio using Groq Whisper API
export async function transcribeAudio(audioBlob: Blob, language: SupportedLanguage): Promise<string> {
    const client = getGroqClient();

    // Convert Blob to File (Groq SDK expects File object)
    const audioFile = new File([audioBlob], "audio.webm", { type: audioBlob.type });

    const transcription = await client.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3-turbo",
        language: language === "ja" ? "ja" : "en",
        response_format: "json",
        temperature: 0.0,
    });

    return transcription.text || "";
}
