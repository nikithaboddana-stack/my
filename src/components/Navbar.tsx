import React from 'react';
import {
  Droplets,
  CloudRain,
  BookOpen,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  LogIn,
  Sprout,
  HelpCircle,
  Bot,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile } from '../models/types';

interface NavbarProps {
  activeTab: 'dashboard' | 'records' | 'crops' | 'planner' | 'weather' | 'assistant' | 'help' | 'knowledge';
  setActiveTab: (tab: 'dashboard' | 'records' | 'crops' | 'planner' | 'weather' | 'assistant' | 'help' | 'knowledge') => void;
  currentUser: User | null;
  userProfile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  userProfile,
  onLogin,
  onLogout,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 border-b border-white/80 shadow-sm shadow-emerald-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Glass Effect */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Droplets className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-gray-900">
                  Agri<span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Flow</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-200/60 shadow-xs">
                  Real-Time
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Farm Water & Agronomy Companion</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-linear-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/20'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('crops')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'crops'
                  ? 'bg-linear-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/20'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>🌾 Crops</span>
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'records'
                  ? 'bg-linear-to-r from-teal-700 to-cyan-700 text-white shadow-md shadow-teal-700/25 ring-2 ring-teal-500/20'
                  : 'text-gray-600 hover:text-teal-800 hover:bg-teal-50/70'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>💧 Water Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-linear-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/25 ring-2 ring-amber-500/20'
                  : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50/70'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>🚿 Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'weather'
                  ? 'bg-linear-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/25 ring-2 ring-sky-500/20'
                  : 'text-gray-600 hover:text-sky-800 hover:bg-sky-50/70'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>🌦️ Weather</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer font-bold ${
                activeTab === 'assistant'
                  ? 'bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/30'
                  : 'text-emerald-900 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-100 border border-emerald-300/80 shadow-xs'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-700" />
              <span>🤖 AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-linear-to-r from-teal-700 to-emerald-700 text-white shadow-md shadow-teal-700/25 ring-2 ring-teal-500/20'
                  : 'text-gray-600 hover:text-teal-800 hover:bg-teal-50/70'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>❓ Help</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'bg-linear-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/20'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Agronomy Library</span>
            </button>
          </nav>

          {/* User Sign in / Status */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2 backdrop-blur-md bg-white/70 p-1.5 pr-2.5 rounded-2xl border border-white/80 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'F'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-bold text-gray-800 truncate max-w-[120px]">
                    {userProfile?.name || currentUser.displayName || 'Farmer'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-1.5 px-4 py-2 bg-linear-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Farmer Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-gray-100 overflow-x-auto text-[11px] font-semibold gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'dashboard' ? 'text-emerald-800 font-bold bg-emerald-100/70' : 'text-gray-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('crops')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'crops' ? 'text-emerald-800 font-bold bg-emerald-100/70' : 'text-gray-500'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Crops</span>
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'records' ? 'text-teal-800 font-bold bg-teal-100/70' : 'text-gray-500'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'planner' ? 'text-amber-800 font-bold bg-amber-100/70' : 'text-gray-500'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'weather' ? 'text-sky-800 font-bold bg-sky-100/70' : 'text-gray-500'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span>Weather</span>
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'assistant' ? 'text-emerald-900 font-bold bg-emerald-200/90 shadow-xs' : 'text-gray-600'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-700" />
            <span>AI Bot</span>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'help' ? 'text-teal-800 font-bold bg-teal-100/70' : 'text-gray-500'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex flex-col items-center px-2 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'knowledge' ? 'text-emerald-800 font-bold bg-emerald-100/70' : 'text-gray-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Library</span>
          </button>
        </div>
      </div>
    </header>
  );
};
