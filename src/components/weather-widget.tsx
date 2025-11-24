import { WeatherSummary } from "@/lib/weather";
import { SupportedLanguage } from "@/lib/i18n";
import { Sun, Droplets, Calendar } from "lucide-react";

interface WeatherWidgetProps {
    data: WeatherSummary;
    language: SupportedLanguage;
}

export function WeatherWidget({ data, language }: WeatherWidgetProps) {
    return (
        <div className="w-full space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                {language === "ja" ? "天気予報" : "Weather Forecast"}
            </h3>

            {/* Current Status */}
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">{data.locationLabel}</p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{data.forecast[0].maxTemp}°</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{data.forecast[0].description}</p>
                        </div>
                        <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900 dark:text-white" />
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            {language === "ja" ? "降水量" : "Precipitation"}
                        </p>
                        <p className="mt-0.5 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{data.current.precipitation} mm</p>
                    </div>
                    <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900 dark:text-white" />
                </div>
            </div>

            {/* Forecast Row */}
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2 sm:grid-cols-3">
                {data.forecast.slice(0, 3).map((day) => (
                    <div key={day.date} className="flex flex-col rounded-md border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-100/40 dark:from-slate-800 dark:to-slate-900 p-2 sm:p-3 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(day.date).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{Math.round(day.maxTemp)}°</span>
                            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">/ {Math.round(day.minTemp)}°</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 truncate">{day.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
