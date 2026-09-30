export interface ApiConfig {
  baseUrl: string;
  geocodingUrl: string;
  timeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
  apiKey?: string;
  customHeaders?: Record<string, string>;
}

export const API_CONFIG: ApiConfig = {
  // Open-Meteo provides free, open-access meteorological REST APIs without requiring secret keys.
  baseUrl: 'https://api.open-meteo.com/v1',
  geocodingUrl: 'https://geocoding-api.open-meteo.com/v1',
  timeoutMs: 9000,
  maxRetries: 2,
  retryDelayMs: 800,
  // If user provides a custom weather API key or enterprise endpoint via env, it merges here
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEATHER_API_KEY) || undefined,
};

export const API_ENDPOINTS = {
  FORECAST: '/forecast',
  GEOCODE_SEARCH: '/search',
} as const;
