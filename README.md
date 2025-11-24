# Travli

*A beautifully designed AI-powered travel planning assistant with real-time weather and intelligent itinerary generation.*

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

### Overview
Travli is a modern, minimalist travel planning assistant that combines real-time global weather data with AI-powered itinerary generation. Featuring a clean monochrome design and intuitive Perplexity-style interface, simply ask "Where do you want to go?" and get comprehensive travel plans with weather forecasts, activity suggestions, and outfit recommendations.

### Core Features

#### Beautiful Design
- **Pure Monochrome UI** - Elegant black and white design for distraction-free planning
- **Centered Layout** - Perplexity-inspired search interface with perfect visual balance
- **Responsive Design** - Seamless experience across mobile, tablet, and desktop
- **Dark Mode Toggle** - Beautiful dark theme with automatic system preference detection
- **Clean Results Page** - Focused content without UI clutter

#### Live Weather Marquee
- **3-Row Animated Display** - Smooth scrolling weather data for 22+ cities
- **Japanese Cities** - Real-time weather for Tokyo, Osaka, Kyoto, Fukuoka, and more
- **Global Capitals** - Live data from London, Delhi, Paris, New York, Sydney, Seoul, Bangkok, Moscow, Cairo, Berlin
- **Background API Fetching** - Instant placeholder data with seamless real-time updates
- **Smart Animation** - Alternating scroll directions with optimized 30-second cycles
- **Weather Icons** - Dynamic sun, cloud, rain, and snow indicators

#### AI-Powered Planning
- **Voice & Text Input** - Speak naturally in Japanese or English, or type your plans
- **Intelligent Itineraries** - Day-by-day travel suggestions using advanced LLM
- **Weather Integration** - Activity recommendations based on real-time forecasts
- **Multi-Day Support** - Plan trips from 1-7 days with detailed daily breakdowns
- **Interactive Maps** - Visual destination mapping with Leaflet integration
- **Smart Outfit Suggestions** - Weather-appropriate clothing recommendations

#### Advanced Features
- **Bilingual Interface** - Full Japanese and English localization
- **Real-time Weather Widget** - Comprehensive forecast with temperature, precipitation, and wind speed
- **Voice Recognition** - Advanced speech-to-text with Groq Whisper integration
- **Progressive Loading** - Instant UI with background data fetching
- **Auto-refresh** - Weather data updates every 10 minutes automatically
- **Error Handling** - Graceful fallbacks for all API services

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with custom animations
- **AI/LLM**: Groq (Llama 3.3 70B & Whisper)
- **Weather APIs**: Open-Meteo + OpenWeatherMap integration
- **Maps**: React Leaflet with OpenStreetMap tiles
- **Voice**: Web Speech API + Groq Whisper transcription
- **State Management**: React hooks with localStorage persistence
- **Animations**: CSS transforms with GPU acceleration

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Travel-Assistance.git
cd Travel-Assistance

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at: https://console.groq.com

### How to Use Travli

#### Step 1: Launch
- Open Travli and see the beautiful centered interface
- Watch the live weather marquee showcasing global cities
- Choose your preferred language (English/Japanese)

#### Step 2: Plan Your Trip
- **Type** your destination: "3 day trip to Tokyo"
- **Speak** naturally: Click the microphone and say your plans
- **Click** weather cities: Tap any city in the marquee for instant planning

#### Step 3: Explore Results
- Browse comprehensive day-by-day itineraries
- View weather forecasts with temperature, precipitation, and wind data
- Get smart outfit recommendations based on conditions
- Explore interactive maps with all destinations marked
- See activity suggestions optimized for the weather

### Example Queries
**English:**
- "Plan for Tokyo tomorrow"
- "2 day trip to Kyoto"
- "Weekend in Osaka"
- "5-day Japan itinerary"
- "What to wear in Tokyo this week?"

**Japanese:**
- "明日の東京のプラン"
- "3日間の京都旅行"
- "週末の大阪観光"
- "北海道の服装は？"
- "福岡の天気と予定"

### Design Philosophy

Travli embraces a **minimalist monochrome aesthetic** inspired by modern design principles:

- **Pure Black & White**: No colors except pure black and white for distraction-free focus
- **Centered Layout**: Perplexity-style search interface with perfect visual hierarchy
- **Smooth Animations**: 30-second marquee cycles with GPU-accelerated transforms
- **Progressive Enhancement**: Instant placeholder data with seamless real-time updates
- **Clean Typography**: Modern font weights with optimal spacing and contrast
- **Responsive Grid**: Fluid layouts that adapt beautifully to any screen size

### Global Weather Integration

**Real-time Data Sources:**
- **Japanese Cities**: Tokyo, Osaka, Kyoto, Fukuoka, Hiroshima, Nagoya, Sendai, Sapporo, Kobe, Nara, Kanazawa, Yokohama
- **World Capitals**: London, Delhi, Paris, New York, Sydney, Seoul, Bangkok, Moscow, Cairo, Berlin

**Smart Features:**
- Background API fetching with staggered requests to avoid rate limits
- Automatic fallback to simulated realistic data if APIs are unavailable
- 10-minute auto-refresh cycles for up-to-date information
- Weather condition mapping to appropriate visual icons

### Deployment

#### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Travel-Assistance)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   OPENWEATHER_API_KEY=your_openweather_key (optional)
   ```
4. Deploy!

### Performance Optimizations

- **Instant Loading**: Placeholder data shows immediately while APIs fetch in background
- **GPU Acceleration**: CSS transforms with `will-change` for smooth animations
- **Efficient Updates**: React state management with minimal re-renders
- **Smart Caching**: Weather data cached with 10-minute refresh intervals
- **Responsive Images**: Optimized assets for different screen densities
- **Code Splitting**: Next.js automatic route-based code splitting

### License
MIT License - see [LICENSE](LICENSE) file for details

### Acknowledgments
- Weather data: [Open-Meteo](https://open-meteo.com/) & [OpenWeatherMap](https://openweathermap.org/)
- AI services: [Groq](https://groq.com/) (Llama 3.3 70B & Whisper)
- Map tiles: [OpenStreetMap](https://www.openstreetmap.org/) contributors
- Icons: [Lucide React](https://lucide.dev/) icon library
- Design inspiration: Modern minimalist interfaces

---

<a name="japanese"></a>
## 日本語

### 概要
Travliは、リアルタイムの世界天気データとAI旅程生成を組み合わせた、モダンでミニマルな旅行計画アシスタントです。清潔なモノクロームデザインと直感的なPerplexityスタイルのインターface「どこに行きたいですか？」で、包括的な旅行プラン、天気予報、アクティビティ提案、服装推奨を提供します。

### 主要機能

#### 美しいデザイン
- **純粋なモノクローム** - 集中できる黒と白のエレガントなデザイン
- **中央配置レイアウト** - 完璧な視覚バランスのPerplexity風検索インターface
- **レスポンシブデザイン** - モバイル、タブレット、デスクトップでのシームレスな体験
- **ダークモード** - システム設定自動検出付きの美しいダークテーマ
- **クリーンな結果ページ** - UIの雑音なしの集中できるコンテンツ

#### ライブ天気マーキー
- **3行アニメーション表示** - 22以上の都市のスムーズスクロール天気データ
- **日本の都市** - 東京、大阪、京都、福岡などのリアルタイム天気
- **世界の首都** - ロンドン、デリー、パリ、ニューヨーク、シドニー、ソウル、バンコク、モスクワ、カイロ、ベルリンのライブデータ
- **バックグラウンドAPI取得** - リアルタイム更新付きの即座のプレースホルダーデータ
- **スマートアニメーション** - 最適化された30秒サイクルでの交互スクロール方向
- **天気アイコン** - 太陽、雲、雨、雪の動的インジケーター

#### AI駆動プランニング
- **音声・テキスト入力** - 日本語または英語での自然な会話、またはタイピング
- **インテリジェント旅程** - 高度なLLMを使用した日ごとの旅行提案
- **天気統合** - リアルタイム予報に基づくアクティビティ推奨
- **複数日サポート** - 詳細な日別内訳での1〜7日間の旅行計画
- **インタラクティブマップ** - Leaflet統合での視覚的な目的地マッピング
- **スマート服装提案** - 天気に適した服装の推奨

### 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **AI/LLM**: Groq (Llama 3.3 70B & Whisper)
- **天気API**: Open-Meteo
- **マップ**: React Leaflet
- **音声**: Web Speech API + Groq Whisper

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/Travel-Assistance.git
cd Travel-Assistance

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.localにGROQ_API_KEYを追加

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 環境変数

`.env.local`ファイルを作成:

```env
GROQ_API_KEY=your_groq_api_key_here
```

無料のGroq APIキーを取得: https://console.groq.com

### Travliの使い方

#### ステップ1: 起動
- Travliを開いて美しい中央配置インターfaceを表示
- 世界の都市を紹介するライブ天気マーキーを見る
- 好みの言語を選択（日本語/英語）

#### ステップ2: 旅行を計画
- **タイプ**: 目的地を入力「3日間の東京旅行」
- **話す**: マイクをクリックして自然に話す
- **クリック**: マーキーの都市をタップして即座に計画

#### ステップ3: 結果を探索
- 包括的な日ごとの旅程を閲覧
- 気温、降水量、風速データ付きの天気予報を表示
- 条件に基づくスマート服装推奨を取得
- すべての目的地がマークされたインタラクティブマップを探索
- 天気に最適化されたアクティビティ提案を見る

### クエリ例
**日本語:**
- "明日の東京のプラン"
- "3日間の京都旅行"
- "週末の大阪観光"
- "5日間の日本旅行"
- "今週の東京の服装は？"

**英語:**
- "Plan for Tokyo tomorrow"
- "2 day trip to Kyoto"
- "Weekend in Osaka"
- "What to wear in Hokkaido?"
- "Fukuoka weather and schedule"

### デプロイ

#### Vercelにデプロイ（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Travel-Assistance)

1. コードをGitHubにプッシュ
2. [Vercel](https://vercel.com)でリポジトリをインポート
3. `GROQ_API_KEY`環境変数を追加
4. デプロイ！

### ライセンス
MITライセンス - 詳細は[LICENSE](LICENSE)ファイルを参照

### 謝辞
- 天気データ: [Open-Meteo](https://open-meteo.com/) & [OpenWeatherMap](https://openweathermap.org/)
- AIサービス: [Groq](https://groq.com/) (Llama 3.3 70B & Whisper)
- マップタイル: [OpenStreetMap](https://www.openstreetmap.org/) 貢献者
- アイコン: [Lucide React](https://lucide.dev/) アイコンライブラリ
- デザインインスピレーション: モダンミニマリストインターface

---

---

### Recent Updates

**v2.0 - Modern UI Overhaul**
- Complete redesign with monochrome aesthetic
- 3-row animated weather marquee with global cities
- Real-time API integration with background fetching
- Centered Perplexity-style search layout
- Removed search bar from results for clean experience
- Added wind speed to weather forecast cards
- Improved mobile responsiveness and animations

---

**Made with Next.js, AI, and modern design principles**

*"Where do you want to go?" - Start your journey with Travli*
