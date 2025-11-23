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
        <div className="w-full space-y-5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                {language === "ja" ? "主要都市の天気" : "Major Cities Weather"}
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {JAPAN_CITIES.map((city) => {
                    const Icon = iconMap[city.icon];
                    return (
                        <button
                            key={city.name}
                            onClick={() => onCityClick(city.name)}
                            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-5 shadow-md hover:shadow-xl hover:border-blue-300 hover:scale-105 transition-all duration-300 cursor-pointer text-left group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {language === "ja" ? city.nameJa : city.name}
                                </p>
                                <Icon className="h-7 w-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{city.temp}°C</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {language === "ja" ? city.conditionJa : city.condition}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
