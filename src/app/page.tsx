"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat-input";
import MapComponent from "@/components/map";
import { WeatherWidget } from "@/components/weather-widget";
import { ItineraryCard } from "@/components/itinerary-card";
import { DaySelector } from "@/components/day-selector";
import { JapanCitiesWeather } from "@/components/japan-cities-weather";
import { parseTravelIntent, generateItinerary, TravelIntent, DailyPlan } from "@/lib/ai";
import { fetchWeatherSummary, WeatherSummary } from "@/lib/weather";
import { useLanguage, LANGUAGES, SupportedLanguage } from "@/lib/i18n";
import { Plane, MapPin, CheckCircle2, Circle, AlertCircle, Moon, Sun } from "lucide-react";

type AppStatus = "idle" | "processing" | "fetching_weather" | "generating_plan" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherSummary | null>(null);
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[] | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [userQuery, setUserQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleSend = async (query: string) => {
    setUserQuery(query);
    setStatus("processing");
    setStatusMessage(t("processingInput"));
    setWeatherData(null);
    setDailyPlans(null);
    setSelectedDayIndex(0);

    try {
      // 1. Parse Intent
      const intent = await parseTravelIntent(query, language);
      console.log("Intent:", intent);

      // 2. Fetch Weather for the full trip duration
      setStatus("fetching_weather");
      setStatusMessage(t("fetchingWeather"));
      const weather = await fetchWeatherSummary({
        location: intent.destination,
        days: Math.max(intent.days, 5), // Fetch at least 5 days
        language: language,
      });
      setWeatherData(weather);

      // 3. Generate Itinerary for multiple days
      setStatus("generating_plan");
      setStatusMessage(t("generatingPlan"));
      const plans = await generateItinerary(intent.destination, weather, intent.days, language);
      setDailyPlans(plans);

      setStatus("success");
    } catch (error: any) {
      console.error("Error:", error);
      setStatus("error");

      // Better error messages
      if (error?.message === "LOCATION_NOT_FOUND") {
        setStatusMessage(
          language === "ja"
            ? "申し訳ありません。その場所が見つかりませんでした。都市名を入れてもう一度お試しください。"
            : "Sorry, I couldn't find that location. Please try again with a city name."
        );
      } else {
        setStatusMessage(t("errorMessage"));
      }
    }
  };

  const handleCityClick = (cityName: string) => {
    const query = language === "ja"
      ? `${cityName}の明日のプランを立てて`
      : `Plan a day trip to ${cityName} tomorrow`;
    handleSend(query);
  };

  const examplePrompts = language === "ja"
    ? [
      "明日の東京のプラン",
      "2日間の京都旅行",
      "3日間の大阪観光",
    ]
    : [
      "Plan for Tokyo tomorrow",
      "2 day trip to Kyoto",
      "3 day trip to Osaka",
    ];

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-black text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-black/95 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-lg shadow-sm">
        <button
          onClick={() => {
            setStatus("idle");
            setWeatherData(null);
            setDailyPlans(null);
            setSelectedDayIndex(0);
            setUserQuery("");
          }}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-black shadow-lg shadow-black/40">
            <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">{t("appName")}</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5 sm:p-1 shadow-sm">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${language === lang.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800"
                  }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 sm:p-2.5 hover:bg-slate-100/60 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
            title={t("newChat")}
          >
            <span className="hidden sm:inline">{t("newChat")}</span>
            <span className="inline sm:hidden">New</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-3 sm:px-4 py-6 sm:py-8 pb-40 sm:pb-48">

        {/* Idle State / Welcome */}
        {status === "idle" && (
          <div className="mt-4 sm:mt-8 text-center space-y-6 sm:space-y-8 animate-fade-in-up">
            <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-900 shadow-2xl shadow-slate-900/40">
              <Plane className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="px-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent mb-3">
                {t("appName")}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* Japan Cities Weather */}
            <div className="mt-8 sm:mt-10 mb-6 sm:mb-8">
              <JapanCitiesWeather language={language} onCityClick={handleCityClick} />
            </div>
          </div>
        )}

        {/* Result View */}
        {(status === "success" || weatherData) && (
          <div className="space-y-8 sm:space-y-12 mb-40 sm:mb-48 animate-fade-in-up">
            {/* User Query Bubble */}
            <div className="flex justify-center px-4">
              <button
                onClick={() => handleSend(userQuery)}
                className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-white shadow-xl max-w-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {userQuery}
              </button>
            </div>

            {/* Weather */}
            {weatherData && (
              <section>
                <WeatherWidget data={weatherData} language={language} />
              </section>
            )}

            {/* Day Selector (for multi-day trips) */}
            {dailyPlans && dailyPlans.length > 1 && (
              <div className="px-4">
                <DaySelector
                  dailyPlans={dailyPlans}
                  selectedDayIndex={selectedDayIndex}
                  onSelectDay={setSelectedDayIndex}
                  language={language}
                />
              </div>
            )}

            {/* Map & Itinerary Grid */}
            {weatherData && dailyPlans && dailyPlans[selectedDayIndex] && (
              <div className="grid grid-cols-1 gap-8">
                {/* Map */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    {t("location")}
                  </h3>
                  <MapComponent
                    center={[weatherData.latitude, weatherData.longitude]}
                    markers={[
                      dailyPlans[selectedDayIndex].morning.coordinates && { lat: dailyPlans[selectedDayIndex].morning.coordinates.lat, lng: dailyPlans[selectedDayIndex].morning.coordinates.lng, label: dailyPlans[selectedDayIndex].morning.title },
                      dailyPlans[selectedDayIndex].afternoon.coordinates && { lat: dailyPlans[selectedDayIndex].afternoon.coordinates.lat, lng: dailyPlans[selectedDayIndex].afternoon.coordinates.lng, label: dailyPlans[selectedDayIndex].afternoon.title },
                      dailyPlans[selectedDayIndex].evening.coordinates && { lat: dailyPlans[selectedDayIndex].evening.coordinates.lat, lng: dailyPlans[selectedDayIndex].evening.coordinates.lng, label: dailyPlans[selectedDayIndex].evening.title },
                    ].filter((m): m is { lat: number; lng: number; label: string } => !!m)}
                  />
                </div>

                {/* Itinerary */}
                <ItineraryCard dailyPlan={dailyPlans[selectedDayIndex]} language={language} />
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {(status === "processing" || status === "fetching_weather" || status === "generating_plan") && (
          <div className="my-12 sm:my-16 mx-auto max-w-2xl flex flex-col items-center gap-6 sm:gap-8 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-200/60 dark:from-slate-900 dark:to-slate-800 p-8 sm:p-12 border-2 border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in-up">
            <div className="relative">
              <div className="h-16 w-16 sm:h-20 sm:w-20 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-200"></div>
              <div className="absolute inset-0 h-16 w-16 sm:h-20 sm:w-20 animate-ping rounded-full border-4 border-slate-900 dark:border-slate-200 opacity-20"></div>
            </div>
            <div className="space-y-2 text-center w-full">
              <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white px-4">{statusMessage}</p>
              <div className="flex flex-col items-start gap-3 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mt-6 sm:mt-8 bg-white/80 dark:bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg w-full max-w-md mx-auto">
                <Step
                  label={t("processingInput")}
                  active={status === "processing"}
                  completed={status !== "processing"}
                />
                <Step
                  label={t("fetchingWeather")}
                  active={status === "fetching_weather"}
                  completed={status !== "processing" && status !== "fetching_weather"}
                />
                <Step
                  label={t("generatingPlan")}
                  active={status === "generating_plan"}
                  completed={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="my-12 sm:my-16 mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 p-6 sm:p-8 text-center border-2 border-slate-200 shadow-lg animate-fade-in-up">
            <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-slate-100">
              <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-slate-700" />
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-800 px-4">{statusMessage}</p>
          </div>
        )}

      </main>

      {/* Input Area (Fixed Bottom) - Now handled by ChatInput component itself */}
      <ChatInput
        onSend={handleSend}
        disabled={status === "processing" || status === "fetching_weather" || status === "generating_plan"}
        placeholder={t("inputPlaceholder")}
      />

      {/* Example Prompts - shown when idle */}
      {status === "idle" && (
        <div className="fixed bottom-24 sm:bottom-28 left-0 right-0 z-40">
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 pb-3">
            {examplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${active ? "text-slate-900 dark:text-slate-100 font-medium" : completed ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600"}`}>
      {completed ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : active ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-slate-100"></div>
      ) : (
        <Circle className="h-5 w-5" />
      )}
      <span>{label}</span>
    </div>
  )
}
