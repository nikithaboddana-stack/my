import React, { useEffect, useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import {
  Droplets,
  Sprout,
  LogIn,
  WifiOff,
} from 'lucide-react';
import {
  FarmDetails,
  FavoriteItem,
  IrrigationSchedule,
  FarmerQuestion,
  UserProfile,
  WaterUsageRecord,
  WeatherReport,
} from './models/types';
import {
  addIrrigationSchedule,
  addWaterRecord,
  deleteIrrigationSchedule,
  deleteWaterRecord,
  saveFarmDetails,
  saveUserProfile,
  subscribeFavorites,
  subscribeFarmDetails,
  subscribeSchedules,
  subscribeUserProfile,
  subscribeWaterRecords,
  subscribeFarmerQuestions,
  addFarmerQuestion,
  deleteFarmerQuestion,
  testConnection,
  toggleFavoriteItem,
  updateScheduleStatus,
} from './services/firebase_service';
import { loginWithGoogle, logoutUser, subscribeAuthState } from './services/auth_service';
import { WeatherApiService } from './services/weather_api_service';
import { calculateWaterAnalytics } from './utils/water_calc';

// Components
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CropSection } from './components/CropSection';
import { WaterUsageTracker } from './components/WaterUsageTracker';
import { WeatherSection } from './components/WeatherSection';
import { IrrigationPlanner } from './components/IrrigationPlanner';
import { FarmerHelpSection } from './components/FarmerHelpSection';
import { KnowledgeLibrary } from './components/KnowledgeLibrary';
import { FarmerAssistant } from './components/FarmerAssistant';
import { FarmSetupModal } from './components/FarmSetupModal';
import { WaterLoggerModal } from './components/WaterLoggerModal';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'records' | 'crops' | 'planner' | 'weather' | 'assistant' | 'help' | 'knowledge'
  >('dashboard');

  // Auth & Connection State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Firestore Real-Time Streams
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [records, setRecords] = useState<WaterUsageRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([]);
  const [farmerQuestions, setFarmerQuestions] = useState<FarmerQuestion[]>([]);

  // Weather REST API State (Real location only; NO fake/default weather!)
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Modals & Action Context
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [actionCrop, setActionCrop] = useState<string>('');

  // 1. Connection test on boot (Firebase skill requirement)
  useEffect(() => {
    testConnection();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Auth State Listener
  useEffect(() => {
    const unsub = subscribeAuthState((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // 3. Realtime Listeners (Attach when user is authenticated)
  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      setFarm(null);
      setRecords([]);
      setFavorites([]);
      setSchedules([]);
      setFarmerQuestions([]);
      return;
    }

    const userId = currentUser.uid;

    const unsubProfile = subscribeUserProfile(userId, (profile) => {
      setUserProfile(profile);
    });

    const unsubFarm = subscribeFarmDetails(userId, (farmDetails) => {
      setFarm(farmDetails);
    });

    const unsubRecords = subscribeWaterRecords(userId, (recs) => {
      setRecords(recs);
    });

    const unsubFavorites = subscribeFavorites(userId, (favs) => {
      setFavorites(favs);
    });

    const unsubSchedules = subscribeSchedules(userId, (scheds) => {
      setSchedules(scheds);
    });

    const unsubQuestions = subscribeFarmerQuestions(userId, (qs) => {
      setFarmerQuestions(qs);
    });

    return () => {
      unsubProfile();
      unsubFarm();
      unsubRecords();
      unsubFavorites();
      unsubSchedules();
      unsubQuestions();
    };
  }, [currentUser]);

  // 4. Fetch Weather ONLY if explicit coordinates are provided (NO hardcoded or guessed location!)
  const loadWeather = async (lat?: number, lon?: number, city?: string) => {
    const targetLat = lat ?? farm?.latitude;
    const targetLon = lon ?? farm?.longitude;
    const targetCity = city ?? farm?.cityName;

    if (targetLat === undefined || targetLon === undefined) {
      setWeather(null);
      return;
    }

    setWeatherLoading(true);
    try {
      const report = await WeatherApiService.fetchLiveWeather(targetLat, targetLon, targetCity);
      setWeather(report);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    if (farm?.latitude !== undefined && farm?.longitude !== undefined) {
      loadWeather(farm.latitude, farm.longitude, farm.cityName);
    } else {
      setWeather(null);
    }
  }, [farm?.latitude, farm?.longitude, farm?.cityName]);

  // 5. Real-Time Water Analytics (Computes real sums, no fake efficiency percentages)
  const analytics = useMemo(() => {
    return calculateWaterAnalytics(records, farm);
  }, [records, farm]);

  // Interconnected Navigation Handlers
  const handlePlanForCrop = (cropName: string) => {
    setActionCrop(cropName);
    setActiveTab('planner');
  };

  const handleRecordForCrop = (cropName: string) => {
    setActionCrop(cropName);
    setIsWaterModalOpen(true);
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // If popup restricted, allow immediate guest farmer sign-in
      const demoUser = {
        uid: 'farmer_local_user',
        displayName: 'Farmer',
        email: 'farmer@agriflow.local',
      } as unknown as User;
      setCurrentUser(demoUser);
      const profile: UserProfile = {
        userId: demoUser.uid,
        name: 'Farmer',
        email: demoUser.email || '',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(profile);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-emerald-50/70 via-sky-50/50 to-amber-50/60 text-gray-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Decorative Agricultural Ambient Glassmorphism Orbs */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-300/25 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-300/25 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-[20%] w-[450px] h-[450px] rounded-full bg-amber-300/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] rounded-full bg-teal-300/20 blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        userProfile={userProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isOnline={isOnline}
      />

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Connection unavailable. Your saved information will be synchronized when connection returns.</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If user is not logged in: Farmer Welcome Card */}
        {!currentUser && (
          <div className="mb-6 p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/80 border border-white/90 shadow-xl shadow-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-linear-to-r from-emerald-100/70 via-teal-50/70 to-sky-100/50">
            <div className="space-y-1.5 max-w-xl text-center sm:text-left">
              <span className="px-3 py-1 bg-white/90 text-emerald-800 rounded-full text-xs font-bold inline-block border border-emerald-200/60 shadow-xs">
                🌱 Free Farmer Access
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Welcome to AgriFlow Real-Time
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                Track water usage, plan crop irrigation, check live weather, and ask farming questions. Sign in with one tap to sync across your phone and tablet.
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-linear-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-700/25 flex items-center space-x-2 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Enter Farm</span>
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard
            farm={farm}
            analytics={analytics}
            records={records}
            favorites={favorites}
            schedules={schedules}
            weather={weather}
            weatherLoading={weatherLoading}
            onRefreshWeather={() => loadWeather()}
            onOpenFarmSetup={() => setIsFarmModalOpen(true)}
            onOpenWaterLogger={() => {
              setActionCrop(farm?.crops?.split(',')[0]?.trim() || '');
              setIsWaterModalOpen(true);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab 2: Crops Directory */}
        {activeTab === 'crops' && (
          <CropSection
            onPlanForCrop={handlePlanForCrop}
            onRecordForCrop={handleRecordForCrop}
          />
        )}

        {/* Tab 3: Water Logs */}
        {activeTab === 'records' && (
          <WaterUsageTracker
            records={records}
            onOpenWaterLogger={() => {
              setActionCrop(farm?.crops?.split(',')[0]?.trim() || '');
              setIsWaterModalOpen(true);
            }}
            onDeleteRecord={async (id) => {
              if (currentUser) {
                await deleteWaterRecord(currentUser.uid, id);
              }
            }}
            onNavigateToKnowledge={() => setActiveTab('knowledge')}
          />
        )}

        {/* Tab 4: Planner */}
        {activeTab === 'planner' && (
          <IrrigationPlanner
            schedules={schedules}
            weather={weather}
            onAddSchedule={async (sched) => {
              await addIrrigationSchedule(sched);
            }}
            onUpdateStatus={async (id, status) => {
              if (currentUser) {
                await updateScheduleStatus(currentUser.uid, id, status);
              }
            }}
            onDeleteSchedule={async (id) => {
              if (currentUser) {
                await deleteIrrigationSchedule(currentUser.uid, id);
              }
            }}
            userId={currentUser?.uid || 'farmer_user'}
            defaultCrop={actionCrop}
          />
        )}

        {/* Tab 5: Live Weather */}
        {activeTab === 'weather' && (
          <WeatherSection
            weather={weather}
            loading={weatherLoading}
            onRefresh={() => loadWeather()}
            onLocationChange={(lat, lon, city) => {
              loadWeather(lat, lon, city);
              if (currentUser && farm) {
                saveFarmDetails({
                  ...farm,
                  latitude: lat,
                  longitude: lon,
                  cityName: city,
                });
              }
            }}
          />
        )}

        {/* Tab 6: AgriFlow Farmer Assistant (Real Gemini AI) */}
        {activeTab === 'assistant' && (
          <FarmerAssistant
            currentUser={currentUser}
            farm={farm}
            records={records}
            analytics={analytics}
            isOnline={isOnline}
            onNavigateToKnowledge={() => setActiveTab('knowledge')}
            onNavigateToRecords={() => setActiveTab('records')}
          />
        )}

        {/* Tab 7: Farmer Help */}
        {activeTab === 'help' && (
          <FarmerHelpSection
            questions={farmerQuestions}
            onAskQuestion={async (q) => {
              await addFarmerQuestion(q);
            }}
            onDeleteQuestion={async (id) => {
              if (currentUser) {
                await deleteFarmerQuestion(currentUser.uid, id);
              }
            }}
            userId={currentUser?.uid || 'farmer_user'}
            onNavigateToKnowledge={() => setActiveTab('knowledge')}
            onNavigateToCrops={() => setActiveTab('crops')}
          />
        )}

        {/* Tab 7: Problem-Oriented Agronomy Knowledge Library */}
        {activeTab === 'knowledge' && (
          <KnowledgeLibrary
            favorites={favorites}
            onToggleFavorite={async (art, currentlyFav) => {
              if (!currentUser) {
                alert('Please sign in to save guides to your farm library.');
                return;
              }
              await toggleFavoriteItem(
                currentUser.uid,
                {
                  itemId: art.id,
                  title: art.title,
                  category: art.category,
                },
                currentlyFav
              );
            }}
            userId={currentUser?.uid || 'farmer_user'}
            isOnline={isOnline}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Clean Educational Footer */}
      <footer className="border-t border-emerald-100/60 bg-white/70 backdrop-blur-md py-6 mt-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-700">AgriFlow Real-Time</span>
            <span>· Farm Water & Irrigation Companion</span>
          </div>

          <div className="text-gray-500">
            Dedicated to sustainable water stewardship and empowering farmers.
          </div>
        </div>
      </footer>

      {/* Farm Setup Modal (Optional Profile) */}
      {currentUser && (
        <FarmSetupModal
          isOpen={isFarmModalOpen}
          onClose={() => setIsFarmModalOpen(false)}
          userId={currentUser.uid}
          existingFarm={farm}
          onSave={async (updatedFarm) => {
            await saveFarmDetails(updatedFarm);
          }}
        />
      )}

      {/* Water Logger Modal */}
      {currentUser && (
        <WaterLoggerModal
          isOpen={isWaterModalOpen}
          onClose={() => {
            setIsWaterModalOpen(false);
            setActionCrop('');
          }}
          userId={currentUser.uid}
          defaultMethod={farm?.irrigationMethod}
          defaultCrop={actionCrop}
          onSaveRecord={async (record) => {
            await addWaterRecord(record);
          }}
        />
      )}
    </div>
  );
}
