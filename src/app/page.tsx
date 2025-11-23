"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat-input";
import MapComponent from "@/components/map";
import { WeatherWidget } from "@/components/weather-widget";
import { ItineraryCard } from "@/components/itinerary-card";
import { JapanCitiesWeather } from "@/components/japan-cities-weather";
import { parseTravelIntent, generateItinerary, TravelIntent, ItinerarySuggestion } from "@/lib/ai";
import { fetchWeatherSummary, WeatherSummary } from "@/lib/weather";
import { useLanguage, LANGUAGES, SupportedLanguage } from "@/lib/i18n";
import { Plane, MapPin, CheckCircle2, Circle, AlertCircle } from "lucide-react";

type AppStatus = "idle" | "processing" | "fetching_weather" | "generating_plan" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherSummary | null>(null);
  const [itinerary, setItinerary] = useState<ItinerarySuggestion | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const { language, setLanguage, t } = useLanguage();

  const handleSend = async (query: string) => {
    setUserQuery(query);
    setStatus("processing");
    setStatusMessage(t("processingInput"));
    setWeatherData(null);
    setItinerary(null);

    try {
      // 1. Parse Intent
      const intent = await parseTravelIntent(query, language);
      console.log("Intent:", intent);

      // 2. Fetch Weather (Always fetch 5 days to have context, but we target one)
      setStatus("fetching_weather");
      setStatusMessage(t("fetchingWeather"));
      const weather = await fetchWeatherSummary({
        location: intent.destination,
        days: 5,
        language: language,
      });
      setWeatherData(weather);

      // 3. Generate Itinerary
      setStatus("generating_plan");
      setStatusMessage(t("generatingPlan"));
      const suggestions = await generateItinerary(intent.destination, weather, language);
      setItinerary(suggestions);

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
      "週末の京都旅行",
      "大阪で食べ歩きしたい",
    ]
    : [
      "Plan for Tokyo tomorrow",
      "Day trip to Kyoto this weekend",
      "Food tour in Osaka",
    ];

  return (
    <div className="min-h-screen font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/60 bg-white/95 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-lg shadow-sm">
        <button
          onClick={() => {
            setStatus("idle");
            setWeatherData(null);
            setItinerary(null);
            setUserQuery("");
          }}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30">
            <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{t("appName")}</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-slate-200 bg-white p-0.5 sm:p-1 shadow-sm">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${language === lang.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
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
            <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-2xl shadow-blue-600/40">
              <Plane className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="px-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-3">
                {t("appName")}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
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

            {/* Map & Itinerary Grid */}
            {weatherData && itinerary && (
              <div className="grid grid-cols-1 gap-8">
                {/* Map */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {t("location")}
                  </h3>
                  <MapComponent
                    center={[weatherData.latitude, weatherData.longitude]}
                    markers={[
                      itinerary.morning.coordinates && { lat: itinerary.morning.coordinates.lat, lng: itinerary.morning.coordinates.lng, label: itinerary.morning.title },
                      itinerary.afternoon.coordinates && { lat: itinerary.afternoon.coordinates.lat, lng: itinerary.afternoon.coordinates.lng, label: itinerary.afternoon.title },
                      itinerary.evening.coordinates && { lat: itinerary.evening.coordinates.lat, lng: itinerary.evening.coordinates.lng, label: itinerary.evening.title },
                    ].filter((m): m is { lat: number; lng: number; label: string } => !!m)}
                  />
                </div>

                {/* Itinerary */}
                <ItineraryCard suggestion={itinerary} language={language} />
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {(status === "processing" || status === "fetching_weather" || status === "generating_plan") && (
          <div className="my-16 sm:my-24 flex flex-col items-center justify-center space-y-6 sm:space-y-8 px-4">
            <div className="relative">
              <div className="h-16 w-16 sm:h-20 sm:w-20 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <div className="absolute inset-0 h-16 w-16 sm:h-20 sm:w-20 animate-ping rounded-full border-4 border-blue-600 opacity-20"></div>
            </div>
            <div className="space-y-2 text-center w-full">
              <p className="text-lg sm:text-xl font-semibold text-slate-900 px-4">{statusMessage}</p>
              <div className="flex flex-col items-start gap-3 sm:gap-4 text-sm text-slate-500 mt-6 sm:mt-8 bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg w-full max-w-md mx-auto">
                <Step
                  label={t("processingInput")}
                  active={status === "processing"}
                  completed={status === "fetching_weather" || status === "generating_plan"}
                />
                <Step
                  label={t("fetchingWeather")}
                  active={status === "fetching_weather"}
                  completed={status === "generating_plan"}
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
          <div className="my-12 sm:my-16 mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 p-6 sm:p-8 text-center border-2 border-red-200 shadow-lg animate-fade-in-up">
            <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <p className="text-base sm:text-lg font-medium text-red-700 px-4">{statusMessage}</p>
          </div>
        )}

      </main>

      {/* Input Area (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200/60 bg-white/98 backdrop-blur-xl px-3 sm:px-4 py-4 sm:py-6 shadow-2xl">
        <div className="mx-auto max-w-4xl">
          <ChatInput
            onSend={handleSend}
            disabled={status !== "idle" && status !== "success" && status !== "error"}
            placeholder={t("inputPlaceholder")}
          />
          {status === "idle" && (
            <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm">
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow text-center"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${active ? "text-blue-600 font-medium" : completed ? "text-green-600" : "text-slate-400"}`}>
      {completed ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : active ? (
        <div className="h-5 w-5 flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
        </div>
      ) : (
        <Circle className="h-5 w-5" />
      )}
      <span>{label}</span>
    </div>
  )
}
