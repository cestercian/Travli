import { ItinerarySuggestion } from "@/lib/ai";
import { SupportedLanguage } from "@/lib/i18n";
import { Sun, Moon, Sunset, Utensils, Briefcase, Bus, Shirt } from "lucide-react";

interface ItineraryCardProps {
    suggestion: ItinerarySuggestion;
    language: SupportedLanguage;
}

export function ItineraryCard({ suggestion, language }: ItineraryCardProps) {
    const titles = language === "ja"
        ? {
            heading: "1日のプラン",
            morning: "午前",
            afternoon: "午後",
            evening: "夜",
            outfit: "おすすめの服装",
            essentials: "旅の必需品",
            meal: "食事",
            item: "持ち物",
            transport: "移動"
        }
        : {
            heading: "Day Plan",
            morning: "Morning",
            afternoon: "Afternoon",
            evening: "Evening",
            outfit: "Outfit Suggestion",
            essentials: "Trip Essentials",
            meal: "Eat",
            item: "Pack",
            transport: "Move"
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
                        <div className="flex items-center gap-2 mb-2 text-orange-600 font-semibold">
                            <Sun className="h-5 w-5" />
                            <span>{titles.morning}</span>
                        </div>
                        <h4 className="text-slate-900 font-bold mb-1">{suggestion.morning.title}</h4>
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-grow">
                            {suggestion.morning.description}
                        </p>
                    </div>
                </div>

                {/* Afternoon */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
                            <Sunset className="h-5 w-5" />
                            <span>{titles.afternoon}</span>
                        </div>
                        <h4 className="text-slate-900 font-bold mb-1">{suggestion.afternoon.title}</h4>
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-grow">
                            {suggestion.afternoon.description}
                        </p>
                    </div>
                </div>

                {/* Evening */}
                <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-indigo-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold">
                            <Moon className="h-5 w-5" />
                            <span>{titles.evening}</span>
                        </div>
                        <h4 className="text-slate-900 font-bold mb-1">{suggestion.evening.title}</h4>
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-grow">
                            {suggestion.evening.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Outfit Section */}
            <div className="rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 to-white p-5 sm:p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-pink-100 rounded-full text-pink-600">
                        <Shirt className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-1">{titles.outfit}</h4>
                        <p className="text-slate-700 leading-relaxed">{suggestion.outfit}</p>
                    </div>
                </div>
            </div>

            {/* Essentials Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    {titles.essentials}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Meal */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                            <Utensils className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{titles.meal}</span>
                            <p className="text-slate-800 font-medium">{suggestion.meal}</p>
                        </div>
                    </div>
                    {/* Item */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{titles.item}</span>
                            <p className="text-slate-800 font-medium">{suggestion.item}</p>
                        </div>
                    </div>
                    {/* Transport */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600 shrink-0">
                            <Bus className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{titles.transport}</span>
                            <p className="text-slate-800 font-medium">{suggestion.transport}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
