import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Planner - AI Travel & Weather Assistant",
  description:
    "Bilingual (Japanese/English) AI-powered travel planner with voice input, real-time weather forecasts, and personalized outfit recommendations for your journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-slate-50 via-slate-100/30 to-blue-50/20 text-slate-900 antialiased`}
      >
        <LanguageProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
