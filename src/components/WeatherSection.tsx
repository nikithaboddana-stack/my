import React, { useState } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  RefreshCw,
  Search,
  MapPin,
  AlertTriangle,
  BookOpen,
  Layers,
  Sparkles,
  Loader2,
  Navigation,
} from 'lucide-react';
import { WeatherReport } from '../models/types';
import { GENERAL_CROP_WATER_BENCHMARKS } from '../data/crop_knowledge';
import { GeocodingResult, WeatherApiService } from '../services/weather_api_service';

interface WeatherSectionProps {
  weather: WeatherReport | null;
  loading: boolean;
  onRefresh: () => void;
  onLocationChange: (lat: number, lon: number, cityName: string) => void;
}

export const WeatherSection: React.FC<WeatherSectionProps> = ({
  weather,
  loading,
  onRefresh,
  onLocationChange,
}) => {
  const [cityInput, setCityInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const results = await WeatherApiService.searchLocations(cityInput.trim());
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('No locations found. Try entering your nearby town or district name.');
      }
    } catch {
      setSearchError('Search failed. Please verify internet connectivity.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (res: GeocodingResult) => {
    const displayName = `${res.name}${res.admin1 ? ', ' + res.admin1 : ''}${res.country ? ', ' + res.country : ''}`;
    onLocationChange(res.latitude, res.longitude, displayName);
    setSearchResults([]);
    setCityInput('');
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingGps(true);
    setSearchError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        onLocationChange(lat, lon, `My Farm Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`);
        setLocatingGps(false);
      },
      (err) => {
        setLocatingGps(false);
        setSearchError('Could not detect location. Please type your town or district name above.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="backdrop-blur-md bg-white/70 rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg shadow-sky-500/5 relative overflow-hidden bg-linear-to-br from-sky-50/70 via-blue-50/50 to-teal-50/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-sky-100/80 text-sky-800 rounded-full text-xs font-bold border border-sky-200/50 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Live Agricultural Weather</span>
              </span>
              <span className="px-2.5 py-0.5 bg-blue-100/60 text-blue-800 rounded-full text-xs font-medium">
                Real-Time Meteorological Station
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Farm Weather & Rain Forecast
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Check live temperature, rain probability, and wind velocity for your exact farm location to decide whether to water or save pump power.
            </p>
          </div>

          {weather?.isLive && (
            <div className="flex items-center gap-2">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-700/20 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Weather</span>
              </button>
            </div>
          )}
        </div>

        {/* Location Search Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-sky-100/80">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative grow">
              <MapPin className="w-4 h-4 text-sky-500 absolute left-3 top-3" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Type your village, town, or district name..."
                className="w-full pl-9 pr-3 py-2 bg-white/90 border border-sky-200/70 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
            >
              {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Find Location</span>
            </button>
            <button
              type="button"
              onClick={handleUseGps}
              disabled={locatingGps}
              title="Detect device GPS location"
              className="px-3 py-2 bg-white/90 hover:bg-white text-sky-800 border border-sky-200/80 font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-sky-600 ${locatingGps ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Use GPS</span>
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-red-600 mt-2 font-medium">{searchError}</p>
          )}

          {searchResults.length > 0 && (
            <div className="mt-2 bg-white text-gray-800 rounded-2xl shadow-lg border border-gray-100 overflow-hidden divide-y divide-gray-100 max-w-xl">
              {searchResults.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => handleSelectResult(res)}
                  className="w-full text-left px-4 py-2.5 text-xs hover:bg-sky-50 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-gray-800">
                    {res.name} {res.admin1 && `(${res.admin1})`}, {res.country}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: LIVE WEATHER DISPLAY OR UNAVAILABLE STATE */}
      {!weather || !weather.isLive ? (
        /* PROMPT MANDATE: Show "Live weather location unavailable" if no reliable location is set */
        <div className="backdrop-blur-md bg-white/80 p-8 rounded-3xl border border-white/80 text-center shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-2xl">
            🌦️
          </div>
          <h3 className="text-base font-bold text-gray-800">Live weather location unavailable</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Please enter your village, town, or district name above, or tap "Use GPS" to display accurate live rainfall and temperature forecasts. We never display fake or guessed weather.
          </p>
        </div>
      ) : (
        /* Genuine Live Weather Data */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-gray-800">
                Live Station: {weather.city}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                LIVE
              </span>
            </div>
            <span className="text-[11px] text-gray-400">Updated {weather.fetchedAt}</span>
          </div>

          {/* Agricultural Advice Banner */}
          {weather.agriAdvice && (
            <div className="backdrop-blur-md bg-white/90 p-4 rounded-2xl border border-sky-200/80 shadow-xs flex items-start space-x-3 text-sky-950">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-800 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-sky-900 uppercase tracking-wider text-[11px]">
                  Farm Water Advisory:
                </span>
                <p className="text-sky-900 leading-relaxed font-medium">{weather.agriAdvice}</p>
              </div>
            </div>
          )}

          {/* Parameter Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl border border-white/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Temperature</span>
                <Thermometer className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">{weather.current.temperature}°C</div>
              <div className="text-[11px] text-gray-500 font-medium">{weather.current.weatherDescription}</div>
            </div>

            <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl border border-white/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Rain Chance</span>
                <CloudRain className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-blue-700">{weather.current.rainProbability}%</div>
              <div className="text-[11px] text-blue-600 font-medium">
                {weather.current.precipitation > 0 ? `${weather.current.precipitation} mm active` : 'No rain right now'}
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl border border-white/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Humidity</span>
                <Droplets className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">{weather.current.humidity}%</div>
              <div className="text-[11px] text-gray-500 font-medium">
                {weather.current.humidity > 65 ? 'High humidity (lower ET)' : 'Dry air (higher ET)'}
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl border border-white/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Wind Speed</span>
                <Wind className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">{weather.current.windSpeed} km/h</div>
              <div className="text-[11px] text-gray-500 font-medium">
                {weather.current.windSpeed > 20 ? 'Sprinkler drift alert' : 'Calm breeze'}
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          {weather.forecast.length > 0 && (
            <div className="backdrop-blur-md bg-white/80 p-5 rounded-3xl border border-white/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                7-Day Rainfall & Irrigation Outlook
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {weather.forecast.map((day) => {
                  const hasRain = day.precipitationProbability >= 45 || day.precipitationSum >= 2;
                  return (
                    <div
                      key={day.date}
                      className={`p-3 rounded-2xl border text-center space-y-1 ${
                        hasRain
                          ? 'bg-blue-50/80 border-blue-200 ring-1 ring-blue-300'
                          : 'bg-white/90 border-gray-100'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-800">
                        {new Date(day.date).toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' })}
                      </div>

                      <div className="flex items-center justify-center py-1">
                        {hasRain ? (
                          <CloudRain className="w-5 h-5 text-blue-600 animate-bounce" />
                        ) : (
                          <Sun className="w-5 h-5 text-amber-500" />
                        )}
                      </div>

                      <div className="text-xs font-bold text-gray-900">
                        {day.tempMax}° / <span className="text-gray-400 font-normal">{day.tempMin}°</span>
                      </div>

                      <div className="text-[10px] font-bold text-blue-700 bg-blue-100/70 rounded py-0.5">
                        {day.precipitationProbability}% Rain
                      </div>

                      <div className="text-[9px] text-gray-500 pt-1 leading-tight">{day.advisory}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: GENERAL FARMING KNOWLEDGE (Always Available) */}
      <div className="space-y-4 pt-4 border-t border-gray-200/80">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            General Crop Water Demand Benchmarks
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
            FAO Reference Data
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Standard reference estimates for seasonal water demand and moisture-critical growth stages. Actual farm application varies by local weather and soil.
        </p>

        <div className="backdrop-blur-md bg-white/80 rounded-3xl border border-white/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50/40 border-b border-gray-100 text-gray-600 font-semibold text-[11px]">
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Standard Seasonal Water (m³/ha)</th>
                  <th className="py-3 px-4">Recommended Method</th>
                  <th className="py-3 px-4">Critical Water Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {GENERAL_CROP_WATER_BENCHMARKS.map((b: import('../data/crop_knowledge').CropWaterBenchmark) => (
                  <tr key={b.crop} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{b.crop}</td>
                    <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">{b.waterPerHaM3}</td>
                    <td className="py-3 px-4 text-gray-700">{b.recommendedMethod}</td>
                    <td className="py-3 px-4 text-gray-600">{b.criticalStage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
