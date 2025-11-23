# 🌏 Travel Planner / 旅行プランナー

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

### 🎯 Overview
An AI-powered travel planning assistant that combines real-time weather data with intelligent itinerary generation. Simply speak or type your travel plans, and get personalized day-by-day recommendations including activities, outfit suggestions, and essential items to pack.

### ✨ Features
- 🎤 **Voice Input** - Speak your travel plans in Japanese or English
- 🌤️ **Real-time Weather** - Live weather forecasts from Open-Meteo API
- 🤖 **AI-Powered Itineraries** - Smart travel suggestions using Groq LLM
- 📅 **Multi-Day Planning** - Plan trips from 1-7 days
- 🗺️ **Interactive Maps** - See your destinations on an interactive map
- 👔 **Outfit Suggestions** - Weather-appropriate clothing recommendations
- 🌓 **Dark Mode** - Beautiful dark theme for comfortable viewing
- 🌐 **Bilingual** - Full support for Japanese and English

### 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI/LLM**: Groq (Llama 3.3 70B & Whisper)
- **Weather API**: Open-Meteo
- **Maps**: React Leaflet
- **Voice**: Web Speech API + Groq Whisper

### 📦 Installation

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

### 🔑 Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at: https://console.groq.com

### 🎮 Usage

1. **Choose Language**: Toggle between English and Japanese
2. **Input Your Plans**: 
   - Type: "3 day trip to Tokyo"
   - Or click the microphone and speak
3. **View Itinerary**: Browse day-by-day plans with activities, meals, and outfit suggestions
4. **Explore Map**: See all your destinations marked on the map

### 📱 Example Queries
- "Plan for Tokyo tomorrow"
- "2 day trip to Kyoto"
- "Weekend in Osaka"
- "明日の東京のプラン"
- "3日間の京都旅行"

### 🌐 Deployment

#### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Travel-Assistance)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add `GROQ_API_KEY` environment variable
4. Deploy!

### 📄 License
MIT License - see [LICENSE](LICENSE) file for details

### 🙏 Acknowledgments
- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- AI powered by [Groq](https://groq.com/)
- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/)

---

<a name="japanese"></a>
## 日本語

### 🎯 概要
リアルタイムの天気データとAIによる旅程生成を組み合わせた旅行計画アシスタント。音声またはテキストで旅行プランを入力するだけで、アクティビティ、服装の提案、必需品を含む日ごとのパーソナライズされた推奨事項を取得できます。

### ✨ 機能
- 🎤 **音声入力** - 日本語または英語で旅行プランを話す
- 🌤️ **リアルタイム天気** - Open-Meteo APIからのライブ天気予報
- 🤖 **AI旅程生成** - Groq LLMを使用したスマートな旅行提案
- 📅 **複数日プランニング** - 1〜7日間の旅行を計画
- 🗺️ **インタラクティブマップ** - 目的地をインタラクティブマップで表示
- 👔 **服装提案** - 天気に適した服装の推奨
- 🌓 **ダークモード** - 快適な閲覧のための美しいダークテーマ
- 🌐 **バイリンガル** - 日本語と英語の完全サポート

### 🚀 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **AI/LLM**: Groq (Llama 3.3 70B & Whisper)
- **天気API**: Open-Meteo
- **マップ**: React Leaflet
- **音声**: Web Speech API + Groq Whisper

### 📦 インストール

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

### 🔑 環境変数

`.env.local`ファイルを作成:

```env
GROQ_API_KEY=your_groq_api_key_here
```

無料のGroq APIキーを取得: https://console.groq.com

### 🎮 使い方

1. **言語を選択**: 英語と日本語を切り替え
2. **プランを入力**: 
   - テキスト入力: "3日間の東京旅行"
   - またはマイクをクリックして話す
3. **旅程を表示**: アクティビティ、食事、服装の提案を含む日ごとのプランを閲覧
4. **マップを探索**: すべての目的地がマップ上にマークされます

### 📱 クエリ例
- "明日の東京のプラン"
- "2日間の京都旅行"
- "週末の大阪観光"
- "Plan for Tokyo tomorrow"
- "3 day trip to Kyoto"

### 🌐 デプロイ

#### Vercelにデプロイ（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Travel-Assistance)

1. コードをGitHubにプッシュ
2. [Vercel](https://vercel.com)でリポジトリをインポート
3. `GROQ_API_KEY`環境変数を追加
4. デプロイ！

### 📄 ライセンス
MITライセンス - 詳細は[LICENSE](LICENSE)ファイルを参照

### 🙏 謝辞
- 天気データ提供: [Open-Meteo](https://open-meteo.com/)
- AI提供: [Groq](https://groq.com/)
- マップタイル: [OpenStreetMap](https://www.openstreetmap.org/)

---

Made with ❤️ using Next.js and AI
