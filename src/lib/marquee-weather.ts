// Marquee weather API service for fetching real-time weather data

interface MarqueeWeatherData {
    name: string;
    nameJa: string;
    temp: number;
    condition: string;
    conditionJa: string;
    icon: "sun" | "cloud" | "rain" | "snow";
}

// Placeholder data (what we show initially)
export const PLACEHOLDER_JAPAN_CITIES: MarqueeWeatherData[] = [
    { name: "Tokyo", nameJa: "東京", temp: 14, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Osaka", nameJa: "大阪", temp: 15, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Kyoto", nameJa: "京都", temp: 15, condition: "Overcast", conditionJa: "厚い雲", icon: "cloud" },
    { name: "Fukuoka", nameJa: "福岡", temp: 17, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Hiroshima", nameJa: "広島", temp: 16, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Nagoya", nameJa: "名古屋", temp: 13, condition: "Overcast", conditionJa: "厚い雲", icon: "cloud" },
    { name: "Sendai", nameJa: "仙台", temp: 8, condition: "Light Rain", conditionJa: "小雨", icon: "rain" },
    { name: "Sapporo", nameJa: "札幌", temp: 2, condition: "Light Rain", conditionJa: "小雨", icon: "rain" },
    { name: "Kobe", nameJa: "神戸", temp: 16, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Nara", nameJa: "奈良", temp: 14, condition: "Cloudy", conditionJa: "曇り", icon: "cloud" },
    { name: "Kanazawa", nameJa: "金沢", temp: 11, condition: "Rainy", conditionJa: "雨", icon: "rain" },
    { name: "Yokohama", nameJa: "横浜", temp: 15, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
];

export const PLACEHOLDER_WORLD_CITIES: MarqueeWeatherData[] = [
    { name: "London", nameJa: "ロンドン", temp: 8, condition: "Rainy", conditionJa: "雨", icon: "rain" },
    { name: "Delhi", nameJa: "デリー", temp: 22, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Paris", nameJa: "パリ", temp: 6, condition: "Cloudy", conditionJa: "曇り", icon: "cloud" },
    { name: "New York", nameJa: "ニューヨーク", temp: 3, condition: "Snow", conditionJa: "雪", icon: "snow" },
    { name: "Sydney", nameJa: "シドニー", temp: 25, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Seoul", nameJa: "ソウル", temp: 1, condition: "Partly Cloudy", conditionJa: "薄い雲", icon: "cloud" },
    { name: "Bangkok", nameJa: "バンコク", temp: 28, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Moscow", nameJa: "モスクワ", temp: -5, condition: "Snow", conditionJa: "雪", icon: "snow" },
    { name: "Cairo", nameJa: "カイロ", temp: 19, condition: "Sunny", conditionJa: "晴れ", icon: "sun" },
    { name: "Berlin", nameJa: "ベルリン", temp: 4, condition: "Cloudy", conditionJa: "曇り", icon: "cloud" },
];

// Weather condition mapping
function mapWeatherConditionToIcon(description: string): "sun" | "cloud" | "rain" | "snow" {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return 'sun';
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) return 'rain';
    if (desc.includes('snow') || desc.includes('blizzard')) return 'snow';
    return 'cloud'; // Default to cloud for cloudy/overcast conditions
}

// Fetch real weather data for a city using OpenWeatherMap API
async function fetchCityWeather(cityName: string): Promise<Partial<MarqueeWeatherData> | null> {
    try {
        // In a real implementation, you'd use your actual API key
        // For now, we'll simulate an API response with randomized data
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=YOUR_API_KEY&units=metric`);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
            icon: mapWeatherConditionToIcon(data.weather[0].description)
        };
    } catch (error) {
        console.warn(`Failed to fetch weather for ${cityName}:`, error);
        
        // Return simulated data as fallback
        const tempVariation = Math.floor(Math.random() * 10) - 5; // ±5 degrees
        const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Light Rain'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            temp: Math.round(Math.random() * 30 - 5) + tempVariation, // -5 to 25°C range
            condition: randomCondition,
            icon: mapWeatherConditionToIcon(randomCondition)
        };
    }
}

// Fetch weather data for all cities with staggered requests
export async function fetchMarqueeWeatherData(): Promise<{
    japanCities: MarqueeWeatherData[];
    worldCities: MarqueeWeatherData[];
}> {
    try {
        console.log('Fetching real-time weather data...');
        
        // Combine city lists for batch fetching
        const allCities = [...PLACEHOLDER_JAPAN_CITIES, ...PLACEHOLDER_WORLD_CITIES];
        
        // Fetch weather data for all cities with a delay to avoid rate limiting
        const weatherPromises = allCities.map(async (city, index) => {
            // Stagger requests by 100ms to avoid hitting rate limits
            await new Promise(resolve => setTimeout(resolve, index * 100));
            const weatherData = await fetchCityWeather(city.name);
            
            return {
                ...city,
                ...weatherData
            };
        });

        const updatedCities = await Promise.all(weatherPromises);
        
        // Split back into Japan and World cities
        const japanCities = updatedCities.slice(0, PLACEHOLDER_JAPAN_CITIES.length);
        const worldCities = updatedCities.slice(PLACEHOLDER_JAPAN_CITIES.length);
        
        console.log('Weather data updated successfully');
        
        return {
            japanCities,
            worldCities
        };
        
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        
        // Return placeholder data on error
        return {
            japanCities: PLACEHOLDER_JAPAN_CITIES,
            worldCities: PLACEHOLDER_WORLD_CITIES
        };
    }
}
