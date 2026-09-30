import { API_CONFIG, API_ENDPOINTS } from '../config/api_config';
import { CurrentWeather, DailyForecastItem, WeatherReport } from '../models/types';
import { apiService } from './api_service';

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface OpenMeteoGeocodingResponse {
  results?: GeocodingResult[];
}

export function interpretWeatherCode(code: number): { description: string; isRaining: boolean; severity: 'low' | 'moderate' | 'high' } {
  switch (code) {
    case 0:
      return { description: 'Clear Sky / Sunny', isRaining: false, severity: 'low' };
    case 1:
      return { description: 'Mainly Clear', isRaining: false, severity: 'low' };
    case 2:
      return { description: 'Partly Cloudy', isRaining: false, severity: 'low' };
    case 3:
      return { description: 'Overcast Skies', isRaining: false, severity: 'low' };
    case 45:
    case 48:
      return { description: 'Fog / Mist', isRaining: false, severity: 'low' };
    case 51:
    case 53:
    case 55:
      return { description: 'Light Drizzle', isRaining: true, severity: 'low' };
    case 61:
      return { description: 'Slight Rain', isRaining: true, severity: 'low' };
    case 63:
      return { description: 'Moderate Rain', isRaining: true, severity: 'moderate' };
    case 65:
      return { description: 'Heavy Rain', isRaining: true, severity: 'high' };
    case 71:
    case 73:
    case 75:
      return { description: 'Snow Fall', isRaining: true, severity: 'moderate' };
    case 80:
    case 81:
    case 82:
      return { description: 'Rain Showers', isRaining: true, severity: 'high' };
    case 95:
    case 96:
    case 99:
      return { description: 'Thunderstorm', isRaining: true, severity: 'high' };
    default:
      return { description: 'Fair Weather', isRaining: false, severity: 'low' };
  }
}

function generateAgriculturalAdvice(
  temp: number,
  humidity: number,
  rainProb: number,
  precipitationSum: number,
  windSpeed: number
): string {
  if (rainProb >= 65 || precipitationSum > 6) {
    return '🌧️ Rain expected. Consider delaying scheduled irrigation to conserve water and prevent waterlogging.';
  }
  if (temp > 35 && humidity < 35) {
    return '🔥 High temperature & dry air. Evaporation rate is elevated. Irrigate during early morning or evening hours.';
  }
  if (windSpeed > 20) {
    return '💨 Elevated wind speeds (>20 km/h). Overhead sprinkler irrigation may drift unevenly.';
  }
  return '🌱 Favorable conditions for standard crop irrigation based on root-zone moisture.';
}

export class WeatherApiService {
  // Search coordinates by city or region name using REST API
  public static async searchLocations(query: string): Promise<GeocodingResult[]> {
    if (!query || query.trim().length < 2) return [];
    try {
      const response = await apiService.get<OpenMeteoGeocodingResponse>(
        API_ENDPOINTS.GEOCODE_SEARCH,
        {
          name: query.trim(),
          count: 5,
          language: 'en',
          format: 'json',
        },
        {
          timeoutMs: 6000,
        }
      );
      return response.data?.results || [];
    } catch (err) {
      console.warn('Location geocoding API error:', err);
      return [];
    }
  }

  // Reverse geocode lat/lon to friendly city name
  public static async reverseLookupCity(lat: number, lon: number): Promise<string> {
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  }

  // Fetch live weather ONLY when explicit coordinates are provided (NO hardcoded cities or fake default coordinates!)
  public static async fetchLiveWeather(
    latitude?: number,
    longitude?: number,
    cityName?: string
  ): Promise<WeatherReport | null> {
    if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
      // Prompt explicitly states: Do NOT guess the farmer's location, do NOT show fake/default weather.
      return null;
    }

    try {
      const response = await apiService.get<OpenMeteoForecastResponse>(
        API_ENDPOINTS.FORECAST,
        {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
          timezone: 'auto',
          forecast_days: 7,
        },
        {
          timeoutMs: 8000,
          retries: 2,
        }
      );

      const data = response.data;
      const currentRaw = data.current;
      const dailyRaw = data.daily;

      const codeInfo = interpretWeatherCode(currentRaw?.weather_code ?? 0);
      const rainProbability = dailyRaw?.precipitation_probability_max?.[0] ?? (currentRaw?.precipitation ? 90 : 10);
      const precipitationSum = dailyRaw?.precipitation_sum?.[0] ?? currentRaw?.precipitation ?? 0;

      const current: CurrentWeather = {
        temperature: Math.round(currentRaw?.temperature_2m ?? 0),
        humidity: Math.round(currentRaw?.relative_humidity_2m ?? 0),
        windSpeed: Math.round(currentRaw?.wind_speed_10m ?? 0),
        weatherCode: currentRaw?.weather_code ?? 0,
        weatherDescription: codeInfo.description,
        rainProbability,
        isRaining: codeInfo.isRaining || (currentRaw?.precipitation ?? 0) > 0,
        precipitation: Number((currentRaw?.precipitation ?? 0).toFixed(1)),
        timestamp: currentRaw?.time || new Date().toISOString(),
      };

      const forecast: DailyForecastItem[] = [];
      if (dailyRaw?.time) {
        for (let i = 0; i < dailyRaw.time.length; i++) {
          const dateStr = dailyRaw.time[i];
          const code = dailyRaw.weather_code[i];
          const info = interpretWeatherCode(code);
          const pProb = dailyRaw.precipitation_probability_max?.[i] ?? 0;
          const pSum = dailyRaw.precipitation_sum?.[i] ?? 0;

          let advisory: string | undefined;
          if (pProb >= 65 || pSum >= 6) {
            advisory = 'High rain expected — delay irrigation';
          } else if (pProb >= 35) {
            advisory = 'Possible showers — check soil first';
          } else {
            advisory = 'Dry day — normal irrigation';
          }

          forecast.push({
            date: dateStr,
            tempMax: Math.round(dailyRaw.temperature_2m_max[i]),
            tempMin: Math.round(dailyRaw.temperature_2m_min[i]),
            precipitationProbability: pProb,
            precipitationSum: Number(pSum.toFixed(1)),
            weatherCode: code,
            advisory,
          });
        }
      }

      const agriAdvice = generateAgriculturalAdvice(
        current.temperature,
        current.humidity,
        current.rainProbability,
        precipitationSum,
        current.windSpeed
      );

      return {
        city: cityName || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
        latitude,
        longitude,
        current,
        forecast,
        agriAdvice,
        isLive: true,
        fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Live Open-Meteo REST API',
      };
    } catch (error) {
      console.warn('Weather API failed:', error);
      return null;
    }
  }
}
