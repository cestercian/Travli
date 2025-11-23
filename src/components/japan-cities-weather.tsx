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
            <h3 className="text-2xl font-bold text-slate-900 text-center">
                {language === "ja" ? "主要都市の天気" : "Major Cities Weather"}
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {JAPAN_CITIES.map((city) => {
                    const Icon = iconMap[city.icon];
                    return (
                        <button
                            key={city.name}
                            onClick={() => onCityClick(city.name)}
                            className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-md hover:shadow-xl hover:border-blue-300 hover:scale-105 transition-all duration-300 cursor-pointer text-left group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-base font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                                    {language === "ja" ? city.nameJa : city.name}
                                </p>
                                <Icon className="h-7 w-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <p className="text-4xl font-bold text-slate-900 mb-2">{city.temp}°C</p>
                            <p className="text-sm text-slate-600">
                                {language === "ja" ? city.conditionJa : city.condition}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
