import { WeatherSummary } from "@/lib/weather";
import { SupportedLanguage } from "@/lib/i18n";
import { Cloud, CloudRain, Sun, Thermometer, Droplets, Calendar } from "lucide-react";

interface WeatherWidgetProps {
    data: WeatherSummary;
    language: SupportedLanguage;
}

export function WeatherWidget({ data, language }: WeatherWidgetProps) {
    return (
        <div className="w-full space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 px-2">
                {language === "ja" ? "天気予報" : "Weather Forecast"}
            </h3>

            {/* Current Status */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500">{data.locationLabel}</p>
                            <p className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{Math.round(data.current.temperature)}°C</p>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1">{data.current.description}</p>
                        </div>
                        <Sun className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500">
                            {language === "ja" ? "降水量" : "Precipitation"}
                        </p>
                        <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">{data.current.precipitation} mm</p>
                    </div>
                    <Droplets className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
            </div>

            {/* Forecast Row */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
                {data.forecast.slice(0, 3).map((day) => (
                    <div key={day.date} className="flex flex-col rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/30 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                        <div className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            {new Date(day.date).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xl sm:text-2xl font-bold text-slate-900">{Math.round(day.maxTemp)}°</span>
                            <span className="text-base sm:text-lg text-slate-500">/ {Math.round(day.minTemp)}°</span>
                        </div>
                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 truncate">{day.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
