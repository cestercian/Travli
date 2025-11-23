import { DailyPlan } from "@/lib/ai";
import { SupportedLanguage } from "@/lib/i18n";
import { Cloud, CloudRain, Sun } from "lucide-react";

interface DaySelectorProps {
    dailyPlans: DailyPlan[];
    selectedDayIndex: number;
    onSelectDay: (index: number) => void;
    language: SupportedLanguage;
}

export function DaySelector({ dailyPlans, selectedDayIndex, onSelectDay, language }: DaySelectorProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const locale = language === "ja" ? "ja-JP" : "en-US";
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(locale, options);
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {dailyPlans.map((plan, index) => {
                const isSelected = index === selectedDayIndex;
                return (
                    <button
                        key={index}
                        onClick={() => onSelectDay(index)}
                        className={`
                            flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all
                            ${isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50'}
                        `}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === "ja" ? `${index + 1}日目` : `Day ${index + 1}`}
                            </span>
                            <span className={`text-sm font-medium ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                {formatDate(plan.date)}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
