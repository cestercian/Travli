import { DailyPlan } from "@/lib/ai";
import { SupportedLanguage } from "@/lib/i18n";
import { Sun, Moon, Sunset, Utensils, Briefcase, Bus, Shirt } from "lucide-react";

interface ItineraryCardProps {
    dailyPlan: DailyPlan;
    language: SupportedLanguage;
}

export function ItineraryCard({ dailyPlan, language }: ItineraryCardProps) {
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
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center px-4">{titles.heading}</h3>

            {/* Timeline */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Morning */}
                <div className="relative overflow-hidden rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-orange-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2 text-orange-600 font-semibold">
                            <Sun className="h-5 w-5" />
                            <span>{titles.morning}</span>
                        </div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-1">{dailyPlan.morning.title}</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed flex-grow">
                            {dailyPlan.morning.description}
                        </p>
                    </div>
                </div>

                {/* Afternoon */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
                            <Sunset className="h-5 w-5" />
                            <span>{titles.afternoon}</span>
                        </div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-1">{dailyPlan.afternoon.title}</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed flex-grow">
                            {dailyPlan.afternoon.description}
                        </p>
                    </div>
                </div>

                {/* Evening */}
                <div className="relative overflow-hidden rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-indigo-100/50 blur-2xl"></div>
                    <div className="relative flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold">
                            <Moon className="h-5 w-5" />
                            <span>{titles.evening}</span>
                        </div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-1">{dailyPlan.evening.title}</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed flex-grow">
                            {dailyPlan.evening.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Outfit Section */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-black p-5 sm:p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                        <Shirt className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{titles.outfit}</h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{dailyPlan.outfit}</p>
                    </div>
                </div>
            </div>

            {/* Essentials Grid */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-black p-5 sm:p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{titles.essentials}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Meal */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                            <Utensils className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{titles.meal}</span>
                            <p className="text-slate-800 dark:text-slate-200 font-medium">{dailyPlan.meal}</p>
                        </div>
                    </div>
                    {/* Item */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{titles.item}</span>
                            <p className="text-slate-800 dark:text-slate-200 font-medium">{dailyPlan.item}</p>
                        </div>
                    </div>
                    {/* Transport */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600 shrink-0">
                            <Bus className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{titles.transport}</span>
                            <p className="text-slate-800 dark:text-slate-200 font-medium">{dailyPlan.transport}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
