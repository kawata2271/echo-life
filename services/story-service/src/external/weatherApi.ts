import axios from 'axios'
import pino from 'pino'

const logger = pino({ name: 'weather-api' })

export interface WeatherInfo {
  description: string
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  tempC: number
}

const DEFAULT_WEATHER: WeatherInfo = {
  description: '晴れ、気温20℃',
  condition: 'sunny',
  tempC: 20,
}

const CONDITION_MAP: Record<string, WeatherInfo['condition']> = {
  Clear: 'sunny',
  Clouds: 'cloudy',
  Rain: 'rainy',
  Drizzle: 'rainy',
  Thunderstorm: 'rainy',
  Snow: 'snowy',
}

const JP_CONDITION: Record<string, string> = {
  sunny: '晴れ',
  cloudy: '曇り',
  rainy: '雨',
  snowy: '雪',
}

export async function getCurrentWeather(city: string): Promise<WeatherInfo> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    logger.debug('No OPENWEATHER_API_KEY set, using default weather')
    return DEFAULT_WEATHER
  }

  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
        lang: 'ja',
      },
      timeout: 5000,
    })

    const main = res.data.weather?.[0]?.main ?? 'Clear'
    const condition = CONDITION_MAP[main] ?? 'sunny'
    const tempC = Math.round(res.data.main?.temp ?? 20)

    return {
      description: `${JP_CONDITION[condition]}、気温${tempC}℃`,
      condition,
      tempC,
    }
  } catch (err) {
    logger.warn({ city, err }, 'Weather API failed, using default')
    return DEFAULT_WEATHER
  }
}
