"use server";

import { getGroqClient } from "./groq";
import { geocodeLocation, WeatherSummary } from "./weather";
import { SupportedLanguage } from "./i18n";

export interface TravelIntent {
    destination: string;
    startDate: string; // ISO date or "tomorrow", "today", "next monday"
    days: number; // 1-7 days
}

export interface Activity {
    title: string;
    description: string;
    locationName: string;
    coordinates?: { lat: number; lng: number };
}

export interface DailyPlan {
    date: string; // ISO date
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
        ? `あなたは旅行アシスタントです。ユーザーのクエリから目的地、開始日、日数を抽出してください。
       JSONオブジェクトのみを返してください。キー："destination"（文字列）、"startDate"（文字列）、"days"（数値）。
       目的地は必ず**英語**で返してください（例："Tokyo", "Osaka"）。
       開始日は可能な限りISO形式（YYYY-MM-DD）に変換するか、相対的な言葉（"tomorrow", "next monday"）をそのまま返してください。
       日数は1-7の範囲で指定してください。言及がない場合は1をデフォルトとしてください。
       例：「明日から3日間東京に行く」→ {"destination": "Tokyo", "startDate": "tomorrow", "days": 3}
       例：「週末に大阪」→ {"destination": "Osaka", "startDate": "next saturday", "days": 2}
       例：「京都に行きたい」→ {"destination": "Kyoto", "startDate": "tomorrow", "days": 1}`
        : `You are a travel assistant. Extract the destination, start date, and trip duration from the user's query.
       Return ONLY a JSON object with keys "destination" (string), "startDate" (string), and "days" (number).
       For destination, extract the CITY NAME only and return it in **ENGLISH**.
       For startDate, try to convert to ISO format (YYYY-MM-DD) if possible, or keep relative terms like "tomorrow", "next monday".
       For days, specify a number between 1-7. If not mentioned, default to 1.
       Example: "3 day trip to Tokyo starting tomorrow" -> {"destination": "Tokyo", "startDate": "tomorrow", "days": 3}
       Example: "Weekend in Osaka" -> {"destination": "Osaka", "startDate": "next saturday", "days": 2}
       Example: "I want to visit Kyoto" -> {"destination": "Kyoto", "startDate": "tomorrow", "days": 1}`;

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
    days: number,
    language: SupportedLanguage
): Promise<DailyPlan[]> {
    const client = getGroqClient();

    // Generate a plan for each day
    const dailyPlans: DailyPlan[] = [];

    for (let dayIndex = 0; dayIndex < days; dayIndex++) {
        const targetDay = weather.forecast[dayIndex];
        if (!targetDay) {
            console.warn(`No weather data for day ${dayIndex + 1}, skipping`);
            continue;
        }

        const weatherContext = `
    Location: ${weather.locationLabel}
    Date: ${targetDay.date}
    Day: ${dayIndex + 1} of ${days}
    Temp: High ${targetDay.maxTemp}°C / Low ${targetDay.minTemp}°C
    Condition: ${targetDay.description}
    Precipitation Chance: ${targetDay.precipitationChance}%
  `;

        const systemPrompt = language === "ja"
            ? `あなたはプロの旅行プランナーです。
       目的地と特定の日の天気予報に基づいて、1日の旅行プランを作成してください。
       これは${days}日間の旅行の${dayIndex + 1}日目です。
       以下のキーを持つJSONオブジェクトのみを返してください：
       - "morning": { "title": "活動名", "description": "詳細な説明", "locationName": "場所の名前(英語で)" }
       - "afternoon": { "title": "活動名", "description": "詳細な説明", "locationName": "場所の名前(英語で)" }
       - "evening": { "title": "活動名", "description": "詳細な説明", "locationName": "場所の名前(英語で)" }
       - "meal": おすすめの食事スポット（1つだけ）。
       - "item": 天気に合わせた必須アイテム（例：雨なら傘、晴れなら日焼け止め）。
       - "transport": その都市での移動のヒント（1行）。
       - "outfit": 天気と活動に合わせた具体的な服装のアドバイス。
       
       重要: "locationName" はGeocodingのために必ず英語の固有名詞（例: "Senso-ji", "Tokyo Tower"）にしてください。
       ${dayIndex > 0 ? "前の日とは違う場所やアクティビティを提案してください。" : ""}
       トーンは親しみやすく、簡潔に。`
            : `You are a professional travel planner.
       Based on the destination and the weather forecast for a specific day, create a one-day itinerary.
       This is day ${dayIndex + 1} of a ${days}-day trip.
       Return ONLY a JSON object with exactly these keys:
       - "morning": { "title": "Activity Title", "description": "Details", "locationName": "Specific Place Name" }
       - "afternoon": { "title": "Activity Title", "description": "Details", "locationName": "Specific Place Name" }
       - "evening": { "title": "Activity Title", "description": "Details", "locationName": "Specific Place Name" }
       - "meal": One specific recommended dining spot or dish.
       - "item": One essential item to pack based on weather (e.g., Umbrella if rain, Sunscreen if sunny).
       - "transport": One specific tip for getting around this city.
       - "outfit": Detailed outfit recommendation based on weather and activities.
       
       IMPORTANT: "locationName" must be a specific, geocodable place name in English (e.g., "Senso-ji", "Tokyo Tower").
       ${dayIndex > 0 ? "Make sure to suggest different locations and activities than the previous days." : ""}
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
        if (!text) {
            console.error(`Failed to generate itinerary for day ${dayIndex + 1}`);
            continue;
        }

        try {
            const dailyPlan = JSON.parse(text) as Omit<DailyPlan, 'date'>;

            // Geocode locations
            const geocodeActivity = async (activity: Activity) => {
                if (activity.locationName) {
                    const query = `${activity.locationName}, ${destination}`;
                    const result = await geocodeLocation(query);
                    if (result) {
                        activity.coordinates = { lat: result.latitude, lng: result.longitude };
                    }
                }
            };

            await Promise.all([
                geocodeActivity(dailyPlan.morning),
                geocodeActivity(dailyPlan.afternoon),
                geocodeActivity(dailyPlan.evening),
            ]);

            dailyPlans.push({
                ...dailyPlan,
                date: targetDay.date
            });
        } catch (e) {
            console.error(`Error parsing/geocoding itinerary for day ${dayIndex + 1}:`, e);
        }
    }

    if (dailyPlans.length === 0) {
        throw new Error("Failed to generate any daily plans");
    }

    return dailyPlans;
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
