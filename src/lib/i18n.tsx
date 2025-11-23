"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export const LANGUAGES = [
    { id: "ja", locale: "ja-JP", label: "日本語" },
    { id: "en", locale: "en-US", label: "English" },
] as const;

export type SupportedLanguage = (typeof LANGUAGES)[number]["id"];

export function getLocaleFromLanguage(language: SupportedLanguage) {
    return LANGUAGES.find((item) => item.id === language)?.locale ?? "ja-JP";
}

// Translation dictionary
export const translations = {
    ja: {
        appName: "トラベルプランナー",
        subtitle: "音声またはテキストで場所を入力してプランを立てましょう",
        newChat: "新しいチャット",
        inputPlaceholder: "天気について聞く...",
        majorCitiesWeather: "主要都市の天気",
        location: "場所",
        recommendedOutfit: "おすすめの服装",
        mainClothing: "メイン服装",
        accessories: "アクセサリー",
        tipsNotes: "ヒント＆メモ",
        processingInput: "入力を処理中...",
        fetchingWeather: "天気データを取得中...",
        generatingPlan: "服装の提案を生成中...",
        errorMessage: "申し訳ありません。そのプランを作成できませんでした。もう一度お試しください。",
        precipitation: "降水量",
        voiceRecording: "録音中...",
        voiceProcessing: "音声を処理中...",
        clickToSpeak: "クリックして話す (日本語・English対応)",
        permissionDenied: "マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。",
    },
    en: {
        appName: "Travel Planner",
        subtitle: "Ask about your plans with your location using voice or text",
        newChat: "New Chat",
        inputPlaceholder: "Ask about the weather...",
        majorCitiesWeather: "Major Cities Weather",
        location: "Location",
        recommendedOutfit: "Recommended Outfit",
        mainClothing: "Main Clothing",
        accessories: "Accessories",
        tipsNotes: "Tips & Notes",
        processingInput: "Processing input...",
        fetchingWeather: "Fetching weather data...",
        generatingPlan: "Generating outfit suggestions...",
        errorMessage: "Sorry, I couldn't plan that trip. Please try again.",
        precipitation: "Precipitation",
        voiceRecording: "Recording...",
        voiceProcessing: "Processing voice...",
        clickToSpeak: "Click to speak (Japanese & English supported)",
        permissionDenied: "Microphone access denied. Please check your browser settings.",
    },
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<SupportedLanguage>("ja");

    useEffect(() => {
        const saved = localStorage.getItem("language") as SupportedLanguage | null;
        if (saved && (saved === "ja" || saved === "en")) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: SupportedLanguage) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations.en[key] || key;
    };

    const value = { language, setLanguage, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
