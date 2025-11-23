import { ItinerarySuggestion } from "@/lib/ai";
import { SupportedLanguage } from "@/lib/i18n";
import { Sun, Sunset, Moon, Utensils, Briefcase, Bus } from "lucide-react";

interface ItineraryCardProps {
    suggestion: ItinerarySuggestion;
    language: SupportedLanguage;
}

export function ItineraryCard({ suggestion, language }: ItineraryCardProps) {
    const titles = {
        heading: language === "ja" ? "1日のプラン" : "Day Plan",
        morning: language === "ja" ? "午前" : "Morning",
        afternoon: language === "ja" ? "午後" : "Afternoon",
        evening: language === "ja" ? "夜" : "Evening",
        essentials: language === "ja" ? "旅の必需品" : "Trip Essentials",
    };

    return (
        <div className="w-full space-y-6 sm:space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center px-4">{titles.heading}</h3>

            {/* Timeline */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Morning */}
                <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-orange-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3 text-orange-600 font-semibold">
                            <Sun className="h-5 w-5" />
                            <span>{titles.morning}</span>
                        </div>
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-grow">
                            {suggestion.morning}
                        </p>
                    </div>
                </div>

                {/* Afternoon */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                            <Sunset className="h-5 w-5" />
                            <span>{titles.afternoon}</span>
                        </div>
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-grow">
                            {suggestion.afternoon}
                        </p>
                    </div>
                </div>

                {/* Evening */}
                <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-indigo-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3 text-indigo-600 font-semibold">
                            <Moon className="h-5 w-5" />
                            <span>{titles.evening}</span>
                        </div>
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-grow">
                            {suggestion.evening}
                        </p>
                    </div>
                </div>
            </div>

            {/* Essentials Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-slate-600" />
                    {titles.essentials}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    {/* Meal */}
                    <div className="pt-4 sm:pt-0 sm:px-4 first:pl-0">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
                            <Utensils className="h-4 w-4" />
                            <span>Eat</span>
                        </div>
                        <p className="text-slate-800 font-medium">{suggestion.meal}</p>
                    </div>

                    {/* Item */}
                    <div className="pt-4 sm:pt-0 sm:px-4">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
                            <Briefcase className="h-4 w-4" />
                            <span>Pack</span>
                        </div>
                        <p className="text-slate-800 font-medium">{suggestion.item}</p>
                    </div>

                    {/* Transport */}
                    <div className="pt-4 sm:pt-0 sm:px-4">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
                            <Bus className="h-4 w-4" />
                            <span>Move</span>
                        </div>
                        <p className="text-slate-800 font-medium">{suggestion.transport}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
