import { SupportedLanguage } from "@/lib/i18n";

const GEOCODE_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODE_MAP: Record<
    number,
    { en: string; ja: string }
> = {
    0: { en: "Clear sky", ja: "快晴" },
    1: { en: "Mainly clear", ja: "晴れ" },
    2: { en: "Partly cloudy", ja: "晴れ時々曇り" },
    3: { en: "Overcast", ja: "曇り" },
    45: { en: "Fog", ja: "霧" },
    48: { en: "Depositing rime fog", ja: "着氷性霧" },
    51: { en: "Light drizzle", ja: "弱い霧雨" },
    53: { en: "Moderate drizzle", ja: "やや強い霧雨" },
    55: { en: "Dense drizzle", ja: "激しい霧雨" },
    56: { en: "Light freezing drizzle", ja: "弱い着氷性霧雨" },
    57: { en: "Dense freezing drizzle", ja: "激しい着氷性霧雨" },
    61: { en: "Slight rain", ja: "弱い雨" },
    63: { en: "Moderate rain", ja: "やや強い雨" },
    65: { en: "Heavy rain", ja: "激しい雨" },
    66: { en: "Light freezing rain", ja: "弱い着氷性の雨" },
    67: { en: "Heavy freezing rain", ja: "激しい着氷性の雨" },
    71: { en: "Slight snow", ja: "弱い雪" },
    73: { en: "Moderate snow", ja: "やや強い雪" },
    75: { en: "Heavy snow", ja: "大雪" },
    77: { en: "Snow grains", ja: "霰・雪粒" },
    80: { en: "Light rain showers", ja: "弱いにわか雨" },
    81: { en: "Moderate rain showers", ja: "やや強いにわか雨" },
    82: { en: "Violent rain showers", ja: "激しいにわか雨" },
    85: { en: "Light snow showers", ja: "弱いにわか雪" },
    86: { en: "Heavy snow showers", ja: "激しいにわか雪" },
    95: { en: "Thunderstorm", ja: "雷雨" },
    96: { en: "Thunderstorm with hail", ja: "雷雨（雹）" },
    99: { en: "Thunderstorm with heavy hail", ja: "激しい雷雨（大きな雹）" },
};

export type WeatherDaily = {
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitationChance: number;
    description: string;
};

export type WeatherCurrent = {
    temperature: number;
    precipitation: number;
    description: string;
};

export type WeatherSummary = {
    locationLabel: string;
    latitude: number;
    longitude: number;
    timezone: string;
    updatedAt: string;
    current: WeatherCurrent;
    forecast: WeatherDaily[];
};

function describeCode(code: number, language: SupportedLanguage) {
    const fallback = language === "ja" ? "天気情報" : "Weather";
    return WEATHER_CODE_MAP[code]?.[language] ?? fallback;
}

function formatLocation(result: GeocodeResult) {
    const parts = [result.name];
    if (result.admin1 && result.admin1 !== result.name) {
        parts.push(result.admin1);
    }
    if (result.country) {
        parts.push(result.country);
    }
    return parts.filter(Boolean).join(", ");
}

type GeocodeResult = {
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
};

type WeatherResponse = {
    current: {
        temperature_2m: number;
        precipitation: number;
        weather_code: number;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: number[];
        weather_code: number[];
    };
    timezone: string;
};

export async function fetchWeatherSummary(params: {
    location: string;
    days: number;
    language: SupportedLanguage;
}): Promise<WeatherSummary> {
    const geocode = await geocodeLocation(params.location);
    if (!geocode) {
        throw new Error("LOCATION_NOT_FOUND");
    }

    const url = new URL(WEATHER_ENDPOINT);
    url.searchParams.set("latitude", geocode.latitude.toString());
    url.searchParams.set("longitude", geocode.longitude.toString());
    url.searchParams.set("current", "temperature_2m,precipitation,weather_code");
    url.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code"
    );
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", params.days.toString());

    const response = await fetch(url, { next: { revalidate: 600 } });
    if (!response.ok) {
        throw new Error("WEATHER_FETCH_FAILED");
    }
    const data = (await response.json()) as WeatherResponse;

    const forecast: WeatherDaily[] = data.daily.time.map((date, index) => ({
        date,
        maxTemp: data.daily.temperature_2m_max[index],
        minTemp: data.daily.temperature_2m_min[index],
        precipitationChance: data.daily.precipitation_probability_max[index],
        description: describeCode(data.daily.weather_code[index], params.language),
    }));

    return {
        locationLabel: formatLocation(geocode),
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        timezone: data.timezone,
        updatedAt: new Date().toISOString(),
        current: {
            temperature: data.current.temperature_2m,
            precipitation: data.current.precipitation,
            description: describeCode(data.current.weather_code, params.language),
        },
        forecast,
    };
}

export async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
    const url = new URL(GEOCODE_ENDPOINT);
    url.searchParams.set("name", query);
    url.searchParams.set("count", "1");
    url.searchParams.set("language", "en");

    console.log(`[Geocode] Querying: ${query}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`[Geocode] API Error: ${response.status} ${response.statusText}`);
            return null;
        }
        const payload = (await response.json()) as { results?: GeocodeResult[] };
        console.log(`[Geocode] Result for ${query}:`, payload.results?.[0]);
        return payload.results?.[0] ?? null;
    } catch (error) {
        console.error(`[Geocode] Network/Fetch Error:`, error);
        return null;
    }
}

export function buildWeatherNarrative(
    summary: WeatherSummary,
    language: SupportedLanguage,
) {
    const locale = language === "ja" ? "ja-JP" : "en-US";
    const dateFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    const headline =
        language === "ja"
            ? `現在の${summary.locationLabel}は${summary.current.description}、気温${Math.round(summary.current.temperature)}℃です。`
            : `Right now in ${summary.locationLabel} it is ${Math.round(summary.current.temperature)}°C with ${summary.current.description.toLowerCase()}.`;

    const details = summary.forecast
        .map((day) =>
            language === "ja"
                ? `${dateFormatter.format(new Date(day.date))}: 最高${Math.round(day.maxTemp)}℃ / 最低${Math.round(day.minTemp)}℃、${day.description}、降水確率${Math.round(day.precipitationChance)}%`
                : `${dateFormatter.format(new Date(day.date))}: high ${Math.round(day.maxTemp)}°C / low ${Math.round(day.minTemp)}°C, ${day.description.toLowerCase()}, ${Math.round(day.precipitationChance)}% rain chance.`,
        )
        .join(language === "ja" ? "。" : " ");

    return `${headline} ${details}`;
}
