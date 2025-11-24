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

// Static weather data for major Japanese cities
// In a real app, this could be fetched from the weather API on load
const JAPAN_CITIES: CityWeatherData[] = [
    { name: "Tokyo", nameJa: "東京", temp: 14, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Osaka", nameJa: "大阪", temp: 15, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Kyoto", nameJa: "京都", temp: 15, condition: "Overcast", conditionJa: "厚い雲", icon: "cloud" },
    { name: "Fukuoka", nameJa: "福岡", temp: 17, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Hiroshima", nameJa: "広島", temp: 16, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Nagoya", nameJa: "名古屋", temp: 13, condition: "Overcast", conditionJa: "厚い雲", icon: "cloud" },
    { name: "Sendai", nameJa: "仙台", temp: 8, condition: "Light Rain", conditionJa: "小雨", icon: "rain" },
    { name: "Sapporo", nameJa: "札幌", temp: 2, condition: "Light Rain", conditionJa: "小雨", icon: "rain" },
];

const iconMap = {
    sun: Sun,
    cloud: Cloud,
    rain: CloudRain,
    snow: CloudSnow,
};

interface JapanCitiesWeatherProps {
    language: SupportedLanguage;
    onCityClick: (cityName: string) => void;
}

export function JapanCitiesWeather({ language, onCityClick }: JapanCitiesWeatherProps) {
    return (
        <div className="w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
                {language === "ja" ? "主要都市の天気" : "Major Cities Weather"}
            </h3>

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                {JAPAN_CITIES.map((city) => {
                    const Icon = iconMap[city.icon];
                    return (
                        <button
                            key={city.name}
                            onClick={() => onCityClick(city.name)}
                            className="rounded-md border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-2 sm:p-3 shadow-sm hover:shadow-md hover:border-slate-400 hover:scale-105 transition-all duration-300 cursor-pointer text-left group"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    {language === "ja" ? city.nameJa : city.name}
                                </p>
                                <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{city.temp}°C</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                {language === "ja" ? city.conditionJa : city.condition}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
