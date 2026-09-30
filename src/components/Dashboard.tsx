import React from 'react';
import {
  Droplets,
  Sprout,
  CalendarCheck,
  BookOpen,
  CloudRain,
  HelpCircle,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react';
import { FarmDetails, FavoriteItem, IrrigationSchedule, WaterUsageRecord, WeatherReport } from '../models/types';
import { WaterAnalytics } from '../utils/water_calc';
import { AGRONOMY_ARTICLES } from '../data/agronomy_knowledge';

interface DashboardProps {
  farm: FarmDetails | null;
  analytics: WaterAnalytics;
  records: WaterUsageRecord[];
  favorites: FavoriteItem[];
  schedules: IrrigationSchedule[];
  weather: WeatherReport | null;
  weatherLoading: boolean;
  onRefreshWeather: () => void;
  onOpenFarmSetup: () => void;
  onOpenWaterLogger: () => void;
  onNavigateTab: (tab: 'dashboard' | 'records' | 'crops' | 'planner' | 'weather' | 'assistant' | 'help' | 'knowledge') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  farm,
  analytics,
  records,
  favorites,
  schedules,
  weather,
  weatherLoading,
  onRefreshWeather,
  onOpenFarmSetup,
  onOpenWaterLogger,
  onNavigateTab,
}) => {
  const pendingSchedules = schedules.filter((s) => s.status === 'pending');
  const recentRecords = records.slice(0, 4);
  const featuredGuides = AGRONOMY_ARTICLES.slice(0, 2);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const farmerName = farm?.farmName || 'Farmer';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER: Welcome to AgriFlow */}
      <div className="backdrop-blur-md bg-white/75 rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg shadow-emerald-500/10 relative overflow-hidden bg-linear-to-br from-emerald-50/80 via-teal-50/50 to-blue-50/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200/60 shadow-xs">
              <span>🌾 {timeGreeting}, {farmerName}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              🌱 Welcome to AgriFlow
            </h1>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
              Manage water. Understand your crops. Make better irrigation decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenWaterLogger}
              className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-xs font-bold shadow-lg shadow-teal-700/25 flex items-center space-x-2 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Water Usage</span>
            </button>
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-4 py-3 backdrop-blur-md bg-white/80 hover:bg-white text-gray-800 border border-white/90 rounded-2xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-amber-600" />
              <span>Plan Irrigation</span>
            </button>
          </div>
        </div>

        {/* Live Weather Digest inside Banner ONLY if real weather exists */}
        {weather?.isLive ? (
          <div className="relative z-10 mt-6 pt-4 border-t border-emerald-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-sky-100/80 text-sky-800">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="text-gray-800 font-medium">
                <span className="font-bold text-gray-900">{weather.city}: </span>
                {weather.current.temperature}°C, {weather.current.weatherDescription} · Rain probability: {weather.current.rainProbability}%
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('weather')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 cursor-pointer"
            >
              <span>Full Weather</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="relative z-10 mt-6 pt-4 border-t border-emerald-100/80 flex items-center justify-between text-xs text-gray-500">
            <span>Live weather location not set yet. Select your location anytime.</span>
            <button
              onClick={() => onNavigateTab('weather')}
              className="font-bold text-teal-800 hover:underline cursor-pointer"
            >
              Select Location →
            </button>
          </div>
        )}
      </div>

      {/* Real AI Assistant Quick Banner */}
      <div
        onClick={() => onNavigateTab('assistant')}
        className="backdrop-blur-xl bg-linear-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white rounded-3xl p-6 shadow-xl shadow-emerald-700/20 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-0.5"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-2xl shrink-0">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base sm:text-lg">AgriFlow Farmer Assistant</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/30 text-white">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Ask anything about your crops, water savings, drip maintenance, or your actual water logs.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white text-emerald-900 rounded-2xl font-bold text-xs shadow-md flex items-center space-x-1.5 shrink-0 cursor-pointer">
          <span>Ask AI Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. PROMINENT SECTION: What do you want to do today? */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight flex items-center space-x-2">
            <span>What do you want to do today?</span>
          </h2>
          <span className="text-xs text-gray-400">Tap an action to begin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 💧 Track Water */}
          <div
            onClick={onOpenWaterLogger}
            className="backdrop-blur-md bg-linear-to-br from-blue-50/80 to-teal-50/60 hover:from-blue-50 hover:to-teal-50 p-5 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💧
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Track Water
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Record how much water you used in your latest irrigation.
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-700 flex items-center space-x-1 pt-1">
              <span>Record now</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 🚿 Plan Irrigation */}
          <div
            onClick={() => onNavigateTab('planner')}
            className="backdrop-blur-md bg-linear-to-br from-amber-50/80 to-yellow-50/60 hover:from-amber-50 hover:to-yellow-50 p-5 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🚿
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-800 transition-colors">
                Plan Irrigation
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Schedule your next irrigation cycle and check rain risks.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-800 flex items-center space-x-1 pt-1">
              <span>Open planner</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 🌾 Learn About Crops */}
          <div
            onClick={() => onNavigateTab('crops')}
            className="backdrop-blur-md bg-linear-to-br from-emerald-50/80 to-green-50/60 hover:from-emerald-50 hover:to-green-50 p-5 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🌾
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                Learn About Crops
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Understand crop water needs, sensitive stages, and tips.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-800 flex items-center space-x-1 pt-1">
              <span>Explore crops</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: 🌱 Understand Soil */}
          <div
            onClick={() => onNavigateTab('knowledge')}
            className="backdrop-blur-md bg-linear-to-br from-lime-50/80 to-emerald-50/60 hover:from-lime-50 hover:to-emerald-50 p-5 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-lime-500/20 text-lime-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🌱
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-lime-800 transition-colors">
                Understand Soil
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Learn how sand, loam, and clay hold and release moisture.
              </p>
            </div>
            <div className="text-[11px] font-bold text-lime-800 flex items-center space-x-1 pt-1">
              <span>Read soil guide</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: 🌦️ Check Weather */}
          <div
            onClick={() => onNavigateTab('weather')}
            className="backdrop-blur-md bg-linear-to-br from-sky-50/80 to-blue-50/60 hover:from-sky-50 hover:to-blue-50 p-5 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🌦️
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-sky-800 transition-colors">
                Check Weather
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                View live temperature and rain forecast for your farm.
              </p>
            </div>
            <div className="text-[11px] font-bold text-sky-800 flex items-center space-x-1 pt-1">
              <span>View weather</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: ❓ Farmer Help */}
          <div
            onClick={() => onNavigateTab('help')}
            className="backdrop-blur-md bg-linear-to-br from-purple-50/80 to-indigo-50/60 hover:from-purple-50 hover:to-indigo-50 p-5 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ❓
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-800 transition-colors">
                Farmer Help
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Ask about a farming problem, yellow leaves, or dry soil.
              </p>
            </div>
            <div className="text-[11px] font-bold text-purple-800 flex items-center space-x-1 pt-1">
              <span>Ask doubt</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: 📚 Learn Water Saving */}
          <div
            onClick={() => onNavigateTab('knowledge')}
            className="backdrop-blur-md bg-linear-to-br from-emerald-50/80 to-teal-50/60 hover:from-emerald-50 hover:to-teal-50 p-5 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5 sm:col-span-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📚
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-teal-800 transition-colors">
                Learn Water Saving & Solve Problems
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Discover practical water-conservation methods, mulching, drip maintenance, and farm ponds.
              </p>
            </div>
            <div className="text-[11px] font-bold text-teal-800 flex items-center space-x-1 pt-1">
              <span>Explore problem solutions</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. YOUR FARM (Optional profile information) */}
      <section className="backdrop-blur-md bg-white/80 p-6 rounded-3xl border border-white/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🏡</span>
            <h3 className="text-sm font-bold text-gray-900">Your Farm Profile</h3>
          </div>
          <button
            onClick={onOpenFarmSetup}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            {farm ? 'Update Details' : '+ Add Details (Optional)'}
          </button>
        </div>

        {farm ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
              <span className="text-gray-500 block text-[10px] uppercase">Farm Name</span>
              <span className="font-bold text-gray-800">{farm.farmName}</span>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100/60">
              <span className="text-gray-500 block text-[10px] uppercase">Area</span>
              <span className="font-bold text-gray-800">
                {farm.farmArea ? `${farm.farmArea} ${farm.areaUnit || 'acres'}` : 'Not specified'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100/60">
              <span className="text-gray-500 block text-[10px] uppercase">Soil & Method</span>
              <span className="font-bold text-gray-800">
                {farm.soilType || 'Soil'} · {farm.irrigationMethod || 'Method'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100/60">
              <span className="text-gray-500 block text-[10px] uppercase">Crops</span>
              <span className="font-bold text-gray-800 truncate block">
                {farm.crops || 'Various crops'}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>You haven't set up an optional farm profile yet. The app works fully without it.</span>
            <button
              onClick={onOpenFarmSetup}
              className="text-emerald-700 font-bold hover:underline cursor-pointer text-left"
            >
              Add Farm Info →
            </button>
          </div>
        )}
      </section>

      {/* 4. WATER OVERVIEW (Genuine records only) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight flex items-center space-x-2">
            <span>💧 Water Overview</span>
          </h2>
          <button
            onClick={() => onNavigateTab('records')}
            className="text-xs font-bold text-teal-800 hover:underline cursor-pointer"
          >
            View All Logs →
          </button>
        </div>

        {!analytics.hasRecords ? (
          /* PROMPT MANDATE: If no records, show: "Start recording water usage to see your farm water insights." */
          <div className="backdrop-blur-md bg-white/80 p-8 rounded-3xl border border-white/80 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-2xl">
              💧
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 max-w-md mx-auto">
              Start recording water usage to see your farm water insights.
            </p>
            <button
              onClick={onOpenWaterLogger}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 inline-flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Irrigation</span>
            </button>
          </div>
        ) : (
          /* Real Firebase Metrics Only (No fake calculations) */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="backdrop-blur-md bg-white/85 p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Total Water Applied</span>
              <div className="text-2xl font-black text-gray-900">
                {analytics.totalWaterLiters.toLocaleString()} <span className="text-xs font-normal text-gray-500">Liters</span>
              </div>
              <div className="text-xs text-teal-700 font-semibold">
                ≈ {analytics.totalWaterM3} m³
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/85 p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Last 7 Days (This Week)</span>
              <div className="text-2xl font-black text-gray-900">
                {analytics.thisWeekLiters.toLocaleString()} <span className="text-xs font-normal text-gray-500">Liters</span>
              </div>
              <div className="text-xs text-gray-500">
                {records.length} total logged sessions
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/85 p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Last 30 Days (This Month)</span>
              <div className="text-2xl font-black text-gray-900">
                {analytics.thisMonthLiters.toLocaleString()} <span className="text-xs font-normal text-gray-500">Liters</span>
              </div>
              <div className="text-xs text-gray-500">
                Daily average: {analytics.avgDailyLiters.toLocaleString()} L
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. UPCOMING IRRIGATION (Actual Firebase schedules) */}
      <section className="backdrop-blur-md bg-white/80 p-6 rounded-3xl border border-white/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
            <span>📅 Upcoming Irrigation</span>
          </h3>
          <button
            onClick={() => onNavigateTab('planner')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
          >
            Open Planner →
          </button>
        </div>

        {pendingSchedules.length === 0 ? (
          <div className="py-4 text-center text-xs text-gray-500 space-y-2">
            <p>No irrigation cycles currently scheduled.</p>
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-3.5 py-1.5 bg-amber-100/80 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs cursor-pointer"
            >
              + Plan an Irrigation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingSchedules.slice(0, 2).map((sched) => (
              <div
                key={sched.id}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-gray-900">{sched.crop}</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    {sched.scheduledDate} {sched.scheduledTime && `· ${sched.scheduledTime}`}
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. LEARN SOMETHING USEFUL (1-2 Problem-oriented guides) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight flex items-center space-x-2">
            <span>💡 Learn Something Useful</span>
          </h2>
          <button
            onClick={() => onNavigateTab('knowledge')}
            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            All Practical Guides →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => onNavigateTab('knowledge')}
              className="backdrop-blur-md bg-white/80 p-5 rounded-3xl border border-white/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase">
                  {guide.problemCategory}
                </span>
                <span className="text-[11px] text-gray-400">{guide.readTime}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                {guide.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {guide.whatIsIt}
              </p>
              <div className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1 pt-1">
                <span>Read guide</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. QUICK TOOLS BAR */}
      <section className="backdrop-blur-md bg-linear-to-r from-emerald-100/40 via-teal-100/30 to-blue-100/40 p-5 rounded-3xl border border-white/80 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3 px-1">
          Quick Tools
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => onNavigateTab('crops')}
            className="p-3 bg-white/90 hover:bg-white rounded-2xl border border-white shadow-xs font-bold text-gray-800 text-center transition-all cursor-pointer"
          >
            🌾 Crop Water Guide
          </button>
          <button
            onClick={() => onNavigateTab('planner')}
            className="p-3 bg-white/90 hover:bg-white rounded-2xl border border-white shadow-xs font-bold text-gray-800 text-center transition-all cursor-pointer"
          >
            🚿 Irrigation Planner
          </button>
          <button
            onClick={() => onNavigateTab('knowledge')}
            className="p-3 bg-white/90 hover:bg-white rounded-2xl border border-white shadow-xs font-bold text-gray-800 text-center transition-all cursor-pointer"
          >
            🌧️ Rainwater Harvesting
          </button>
          <button
            onClick={() => onNavigateTab('records')}
            className="p-3 bg-white/90 hover:bg-white rounded-2xl border border-white shadow-xs font-bold text-gray-800 text-center transition-all cursor-pointer"
          >
            📊 Water Usage Logs
          </button>
        </div>
      </section>
    </div>
  );
};
