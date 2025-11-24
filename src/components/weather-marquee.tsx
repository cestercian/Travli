import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, CloudSnow } from "lucide-react";
import { SupportedLanguage } from "@/lib/i18n";
import { fetchMarqueeWeatherData, PLACEHOLDER_JAPAN_CITIES, PLACEHOLDER_WORLD_CITIES } from "@/lib/marquee-weather";

interface CityWeatherData {
    name: string;
    nameJa: string;
    temp: number;
    condition: string;
    conditionJa: string;
    icon: "sun" | "cloud" | "rain" | "snow";
}


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
    // State for weather data with placeholder initial values
    const [japanCities, setJapanCities] = useState(PLACEHOLDER_JAPAN_CITIES);
    const [worldCities, setWorldCities] = useState(PLACEHOLDER_WORLD_CITIES);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch real weather data in the background
    useEffect(() => {
        const fetchWeatherData = async () => {
            setIsLoading(true);
            try {
                const { japanCities: updatedJapanCities, worldCities: updatedWorldCities } = await fetchMarqueeWeatherData();
                setJapanCities(updatedJapanCities);
                setWorldCities(updatedWorldCities);
            } catch (error) {
                console.error('Failed to update weather data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch immediately on mount
        fetchWeatherData();

        // Set up periodic updates every 10 minutes
        const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Split cities into three rows
    const firstRowCities = japanCities.slice(0, 6);
    const secondRowCities = japanCities.slice(6);
    const thirdRowCities = worldCities;

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

            {/* Third row - worldwide cities moving right to left (faster) */}
            <div className="relative overflow-hidden">
                <div className="flex animate-marquee-right-to-left-fast" style={{ width: 'max-content' }}>
                    {/* Duplicate items for seamless loop */}
                    {[...thirdRowCities, ...thirdRowCities].map((city, index) => (
                        <WeatherItem key={`row3-${index}`} city={city} />
                    ))}
                </div>
            </div>
        </div>
    );
}
