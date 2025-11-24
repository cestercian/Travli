import { Cloud, CloudRain, Sun, CloudSnow } from "lucide-react";
import { SupportedLanguage } from "@/lib/i18n";

interface CityWeatherData {
    name: string;
    nameJa: string;
    temp: number;
    condition: string;
    conditionJa: string;
    icon: "sun" | "cloud" | "rain" | "snow";
}

// Extended weather data for marquee effect
const JAPAN_CITIES: CityWeatherData[] = [
    { name: "Tokyo", nameJa: "東京", temp: 14, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Osaka", nameJa: "大阪", temp: 15, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Kyoto", nameJa: "京都", temp: 15, condition: "Overcast", conditionJa: "厚い雲", icon: "cloud" },
    { name: "Fukuoka", nameJa: "福岡", temp: 17, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Hiroshima", nameJa: "広島", temp: 16, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Nagoya", nameJa: "名古屋", temp: 13, condition: "Overcast", conditionJa: "厚い雲", icon: "cloud" },
    { name: "Sendai", nameJa: "仙台", temp: 8, condition: "Light Rain", conditionJa: "小雨", icon: "rain" },
    { name: "Sapporo", nameJa: "札幌", temp: 2, condition: "Light Rain", conditionJa: "小雨", icon: "rain" },
    { name: "Kobe", nameJa: "神戸", temp: 16, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Nara", nameJa: "奈良", temp: 14, condition: "Cloudy", conditionJa: "曇り", icon: "cloud" },
    { name: "Kanazawa", nameJa: "金沢", temp: 11, condition: "Rainy", conditionJa: "雨", icon: "rain" },
    { name: "Yokohama", nameJa: "横浜", temp: 15, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
];

// Worldwide capital cities for third row
const WORLD_CITIES: CityWeatherData[] = [
    { name: "London", nameJa: "ロンドン", temp: 8, condition: "Rainy", conditionJa: "雨", icon: "rain" },
    { name: "Delhi", nameJa: "デリー", temp: 22, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Paris", nameJa: "パリ", temp: 6, condition: "Cloudy", conditionJa: "曇り", icon: "cloud" },
    { name: "New York", nameJa: "ニューヨーク", temp: 3, condition: "Snow", conditionJa: "雪", icon: "snow" },
    { name: "Sydney", nameJa: "シドニー", temp: 25, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Seoul", nameJa: "ソウル", temp: 1, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Bangkok", nameJa: "バンコク", temp: 28, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Moscow", nameJa: "モスクワ", temp: -5, condition: "Snow", conditionJa: "雪", icon: "snow" },
    { name: "Cairo", nameJa: "カイロ", temp: 19, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Berlin", nameJa: "ベルリン", temp: 4, condition: "Cloudy", conditionJa: "曇り", icon: "cloud" },
];

const iconMap = {
    sun: Sun,
    cloud: Cloud,
    rain: CloudRain,
    snow: CloudSnow,
};

interface WeatherMarqueeProps {
    language: SupportedLanguage;
    onCityClick: (cityName: string) => void;
}

export function WeatherMarquee({ language, onCityClick }: WeatherMarqueeProps) {
    // Split cities into three rows
    const firstRowCities = JAPAN_CITIES.slice(0, 6);
    const secondRowCities = JAPAN_CITIES.slice(6);
    const thirdRowCities = WORLD_CITIES;

    const WeatherItem = ({ city }: { city: CityWeatherData }) => {
        const Icon = iconMap[city.icon];
        return (
            <button
                onClick={() => onCityClick(city.name)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 sm:px-8 py-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer whitespace-nowrap mx-2"
            >
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="font-medium">
                    {language === "ja" ? city.nameJa : city.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                    {city.temp}°C
                </span>
            </button>
        );
    };

    return (
        <div className="w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-6">
                {language === "ja" ? "世界の主要都市" : "Major Cities Weather"}
            </h3>

            {/* First row - moving right to left */}
            <div className="relative overflow-hidden">
                <div className="flex animate-marquee-right-to-left">
                    {/* Duplicate items for seamless loop */}
                    {[...firstRowCities, ...firstRowCities].map((city, index) => (
                        <WeatherItem key={`row1-${index}`} city={city} />
                    ))}
                </div>
            </div>

            {/* Second row - moving left to right */}
            <div className="relative overflow-hidden">
                <div className="flex animate-marquee-left-to-right">
                    {/* Duplicate items for seamless loop */}
                    {[...secondRowCities, ...secondRowCities].map((city, index) => (
                        <WeatherItem key={`row2-${index}`} city={city} />
                    ))}
                </div>
            </div>

            {/* Third row - worldwide cities moving right to left */}
            <div className="relative overflow-hidden">
                <div className="flex animate-marquee-right-to-left">
                    {/* Duplicate items for seamless loop */}
                    {[...thirdRowCities, ...thirdRowCities].map((city, index) => (
                        <WeatherItem key={`row3-${index}`} city={city} />
                    ))}
                </div>
            </div>
        </div>
    );
}
