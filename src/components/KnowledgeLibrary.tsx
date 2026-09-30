import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Bookmark,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Gauge,
  Droplets,
  Activity,
  Compass,
} from 'lucide-react';
import { AGRONOMY_ARTICLES, AGRONOMY_CATEGORIES, PROBLEM_CATEGORIES } from '../data/agronomy_knowledge';
import { FavoriteItem, KnowledgeArticle, AgronomyCategory, ProblemCategory } from '../models/types';

interface KnowledgeLibraryProps {
  favorites: FavoriteItem[];
  onToggleFavorite: (article: KnowledgeArticle, isCurrentlyFavorite: boolean) => Promise<void>;
  userId: string;
  isOnline?: boolean;
  onNavigateTab: (tab: 'dashboard' | 'records' | 'crops' | 'planner' | 'weather' | 'help' | 'knowledge') => void;
}

export const KnowledgeLibrary: React.FC<KnowledgeLibraryProps> = ({
  favorites,
  onToggleFavorite,
  userId,
  isOnline = true,
  onNavigateTab,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgronomyCategory | 'ALL'>('ALL');
  const [selectedProblem, setSelectedProblem] = useState<ProblemCategory | 'ALL'>('ALL');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(AGRONOMY_ARTICLES[0].id);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.itemId)), [favorites]);

  // Enhanced search matching title, keywords, category, problem, whatIsIt, whyItMatters, etc.
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();

    return AGRONOMY_ARTICLES.filter((art) => {
      const isFav = favoriteIds.has(art.id);
      if (showSavedOnly && !isFav) return false;

      const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
      if (!matchesCat) return false;

      const matchesProblem = selectedProblem === 'ALL' || art.problemCategory === selectedProblem;
      if (!matchesProblem) return false;

      if (!q) return true;

      const titleMatch = art.title.toLowerCase().includes(q);
      const categoryMatch = art.category.toLowerCase().includes(q) || art.problemCategory.toLowerCase().includes(q);
      const whatMatch = art.whatIsIt.toLowerCase().includes(q);
      const whyMatch = art.whyItMatters.toLowerCase().includes(q);
      const keywordMatch = art.keywords.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
      const checksMatch = art.thingsToCheck.some((t) => t.toLowerCase().includes(q));
      const stepsMatch = art.whatCanFarmerDo.some((s) => s.toLowerCase().includes(q));
      const benefitsMatch = art.benefits?.some((b) => b.toLowerCase().includes(q)) ?? false;

      return titleMatch || categoryMatch || whatMatch || whyMatch || keywordMatch || checksMatch || stepsMatch || benefitsMatch;
    });
  }, [search, selectedCategory, selectedProblem, showSavedOnly, favoriteIds]);

  const handleBookmarkToggle = async (article: KnowledgeArticle) => {
    if (!isOnline) {
      setOfflineNotice("You're offline. Your saved guides will sync when the connection returns.");
      setTimeout(() => setOfflineNotice(null), 5000);
    }
    setSavingId(article.id);
    const isCurrentlyFav = favoriteIds.has(article.id);
    try {
      await onToggleFavorite(article, isCurrentlyFav);
    } catch {
      setOfflineNotice("You're offline. Your saved guides will sync when the connection returns.");
      setTimeout(() => setOfflineNotice(null), 5000);
    } finally {
      setSavingId(null);
    }
  };

  const getCategoryTheme = (category: AgronomyCategory) => {
    switch (category) {
      case 'Irrigation Technology':
        return {
          bgBadge: 'bg-teal-100/90 text-teal-900 border-teal-200/80',
          gradientCard: 'from-teal-500/15 via-emerald-500/10 to-cyan-500/15',
          borderAccent: 'border-teal-200/70',
          iconColor: 'text-teal-700',
        };
      case 'Soil Moisture':
        return {
          bgBadge: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/80',
          gradientCard: 'from-emerald-500/15 via-teal-500/10 to-amber-500/10',
          borderAccent: 'border-emerald-200/70',
          iconColor: 'text-emerald-700',
        };
      case 'Crop Water Needs':
        return {
          bgBadge: 'bg-amber-100/90 text-amber-950 border-amber-200/80',
          gradientCard: 'from-amber-500/15 via-yellow-500/10 to-emerald-500/10',
          borderAccent: 'border-amber-200/70',
          iconColor: 'text-amber-700',
        };
      case 'Drought Resilience':
        return {
          bgBadge: 'bg-orange-100/90 text-orange-950 border-orange-200/80',
          gradientCard: 'from-orange-500/15 via-amber-500/10 to-red-500/10',
          borderAccent: 'border-orange-200/70',
          iconColor: 'text-orange-700',
        };
      case 'Rainwater':
        return {
          bgBadge: 'bg-sky-100/90 text-sky-950 border-sky-200/80',
          gradientCard: 'from-sky-500/15 via-blue-500/10 to-cyan-500/15',
          borderAccent: 'border-sky-200/70',
          iconColor: 'text-sky-700',
        };
      default:
        return {
          bgBadge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          gradientCard: 'from-emerald-50 to-teal-50',
          borderAccent: 'border-emerald-200',
          iconColor: 'text-emerald-700',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. MANDATORY NOTICE AT THE TOP */}
      <div className="p-4 sm:p-5 rounded-3xl backdrop-blur-xl bg-amber-50/85 border border-amber-200/90 text-amber-950 shadow-md shadow-amber-900/5 flex items-start space-x-3.5 transition-all">
        <div className="p-2.5 rounded-2xl bg-amber-200/80 text-amber-900 shrink-0 mt-0.5 shadow-xs">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="font-extrabold text-amber-950 tracking-tight flex items-center space-x-1.5">
            <span>Agricultural Guidance & Reference Notice</span>
          </div>
          <p className="text-amber-900 leading-relaxed font-medium">
            These guides provide general agricultural information and reference values. Actual irrigation requirements vary with crop, growth stage, soil, weather, irrigation system, and local farm conditions.
          </p>
        </div>
      </div>

      {offlineNotice && (
        <div className="p-3.5 backdrop-blur-md bg-blue-50/90 border border-blue-200 text-blue-900 rounded-2xl text-xs flex items-center justify-between shadow-xs">
          <span>{offlineNotice}</span>
          <button onClick={() => setOfflineNotice(null)} className="text-blue-700 font-bold ml-2 hover:text-blue-950">
            ✕
          </button>
        </div>
      )}

      {/* 2. COLORFUL GLASSMORPHISM HERO BANNER */}
      <div className="backdrop-blur-xl bg-white/75 rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl shadow-emerald-500/10 relative overflow-hidden bg-linear-to-br from-emerald-100/70 via-teal-50/60 to-sky-100/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-white/80 text-emerald-900 border border-emerald-200/60 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>🌾 Agronomy & Water Conservation Library</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Practical Farm Water Solutions
            </h1>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              Actionable agronomic guides crafted for working farmers. Filter by technology, soil moisture, crop needs, or specific field challenges to optimize every drop.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                showSavedOnly
                  ? 'bg-linear-to-r from-emerald-700 to-teal-700 text-white shadow-emerald-700/30'
                  : 'backdrop-blur-md bg-white/80 text-emerald-900 hover:bg-white border border-emerald-200/70 hover:shadow-emerald-600/15'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-white' : ''}`} />
              <span>{favorites.length > 0 ? `Saved Guides (${favorites.length})` : 'Saved Guides (0)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY TABS (Browse by Category: Irrigation Technology, Soil Moisture, etc.) */}
      <div className="backdrop-blur-xl bg-white/80 p-4 sm:p-5 rounded-3xl border border-white/80 shadow-md shadow-emerald-900/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-700">
              Browse by Agricultural Category
            </h2>
          </div>
          {(selectedCategory !== 'ALL' || selectedProblem !== 'ALL' || showSavedOnly || search) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedProblem('ALL');
                setShowSavedOnly(false);
                setSearch('');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setShowSavedOnly(false);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs ${
              selectedCategory === 'ALL'
                ? 'bg-linear-to-r from-emerald-700 to-teal-700 text-white shadow-emerald-700/25'
                : 'backdrop-blur-md bg-gray-50/90 text-gray-700 hover:bg-white border border-gray-200/70 hover:text-emerald-800'
            }`}
          >
            <span>📚</span>
            <span>All Categories ({AGRONOMY_ARTICLES.length})</span>
          </button>

          {AGRONOMY_CATEGORIES.map((cat) => {
            const count = AGRONOMY_ARTICLES.filter((a) => a.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'ALL' : cat.id);
                  setShowSavedOnly(false);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs ${
                  isSelected
                    ? 'bg-linear-to-r from-emerald-700 to-teal-700 text-white shadow-emerald-700/25 ring-2 ring-emerald-500/20'
                    : 'backdrop-blur-md bg-white/80 text-gray-700 hover:bg-white border border-gray-200/70 hover:text-emerald-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. PROBLEM-ORIENTED SHORTCUT CARDS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center space-x-1.5">
            <span>🎯 Or Pick What Problem You Are Facing:</span>
          </h2>
          {selectedProblem !== 'ALL' && (
            <button
              onClick={() => setSelectedProblem('ALL')}
              className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
            >
              Clear Problem Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PROBLEM_CATEGORIES.map((cat) => {
            const isSelected = selectedProblem === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedProblem(isSelected ? 'ALL' : cat.id);
                  setShowSavedOnly(false);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer hover:-translate-y-0.5 ${
                  isSelected
                    ? 'bg-linear-to-br from-emerald-700 to-teal-800 text-white border-emerald-900 shadow-md shadow-emerald-700/30'
                    : 'backdrop-blur-xl bg-white/80 hover:bg-white border-white/90 text-gray-800 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-2xl mb-1.5">{cat.icon}</span>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {cat.title}
                  </div>
                  <div className={`text-[10px] mt-1 line-clamp-2 leading-tight ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {cat.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. SEARCH BAR */}
      <div className="backdrop-blur-xl bg-white/80 p-3 rounded-2xl border border-white/80 shadow-sm flex items-center space-x-2">
        <Search className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guides (e.g. drip, emitter clogging, filter flush, soil texture, AWC, ETc, mulch, pond, deficit)..."
          className="w-full text-xs text-gray-900 bg-transparent placeholder-gray-400 focus:outline-hidden font-medium"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-600 px-2 cursor-pointer">
            Clear
          </button>
        )}
      </div>

      {/* 6. GUIDES LIST */}
      <div className="space-y-4">
        {searchResults.length === 0 ? (
          <div className="p-8 backdrop-blur-xl bg-white/70 rounded-3xl border border-white/80 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="text-sm font-bold text-gray-800">No matching guides found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try searching for "drip", "soil", "evaporation", "pond", or tap "Reset All Filters" above.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedProblem('ALL');
                setShowSavedOnly(false);
                setSearch('');
              }}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          searchResults.map((article) => {
            const isExpanded = expandedArticleId === article.id;
            const isFav = favoriteIds.has(article.id);
            const isSaving = savingId === article.id;
            const theme = getCategoryTheme(article.category);

            return (
              <div
                key={article.id}
                className={`backdrop-blur-xl bg-white/85 rounded-3xl border transition-all overflow-hidden shadow-sm hover:shadow-md ${
                  isExpanded ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-white/80'
                }`}
              >
                {/* Guide Header Banner */}
                <div
                  className={`p-5 sm:p-6 bg-linear-to-r ${theme.gradientCard} flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none`}
                  onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                >
                  <div className="space-y-2 grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${theme.bgBadge}`}>
                        {article.category}
                      </span>
                      <span className="text-[11px] font-medium text-gray-600 bg-white/70 px-2 py-0.5 rounded-full border border-gray-200/50">
                        {article.readTime}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                        {article.benefitLabel}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                      {article.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {article.whatIsIt}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkToggle(article);
                      }}
                      title={isFav ? 'Remove from saved' : 'Save guide to farm library'}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isFav
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                          : 'backdrop-blur-md bg-white/80 text-gray-500 hover:text-emerald-700 border-gray-200/60'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-600' : ''}`} />
                    </button>

                    <button
                      type="button"
                      className="p-2.5 rounded-2xl bg-white/80 text-gray-700 hover:bg-white border border-gray-200/60 transition-all cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Content */}
                {isExpanded && (
                  <div className="p-5 sm:p-7 space-y-6 border-t border-gray-100/80 bg-white/50 text-gray-800 animate-in fade-in duration-150">
                    {/* 1. What It Is & How Water Reaches the Root Zone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/80 border border-gray-200/60 shadow-xs space-y-1.5">
                        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          <span>What It Is</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {article.whatIsIt}
                        </p>
                      </div>

                      {article.howWaterReachesRoots && (
                        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/60 shadow-xs space-y-1.5">
                          <div className="flex items-center space-x-2 text-sky-900 font-bold text-xs uppercase tracking-wider">
                            <Droplets className="w-4 h-4 text-sky-600" />
                            <span>How Water Reaches Root Zone</span>
                          </div>
                          <p className="text-xs text-sky-950 leading-relaxed font-medium">
                            {article.howWaterReachesRoots}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 2. Key Benefits (e.g. Reduced Runoff, Application Control) */}
                    {article.benefits && article.benefits.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          <span>Key Advantages For Your Farm</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {article.benefits.map((b, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-linear-to-r from-emerald-50/60 to-teal-50/60 border border-emerald-100 text-xs text-gray-800 flex items-start space-x-2.5"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Special Technical Focus for Drip (Filtration, Pressure, Flushing) */}
                    {article.filtrationAndPressure && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-teal-50/90 via-cyan-50/70 to-emerald-50/80 border border-teal-200/80 shadow-xs space-y-2">
                        <div className="flex items-center space-x-2 text-teal-900 font-extrabold text-xs uppercase tracking-wider">
                          <Gauge className="w-4 h-4 text-teal-700" />
                          <span>Filtration & Operating Pressure Control</span>
                        </div>
                        <p className="text-xs text-teal-950 leading-relaxed font-medium">
                          {article.filtrationAndPressure}
                        </p>
                      </div>
                    )}

                    {article.lateralFlushingAndInspection && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-sky-50/90 via-blue-50/70 to-indigo-50/70 border border-sky-200/80 shadow-xs space-y-2">
                        <div className="flex items-center space-x-2 text-sky-900 font-extrabold text-xs uppercase tracking-wider">
                          <Activity className="w-4 h-4 text-sky-700" />
                          <span>Lateral Flushing & Emitter Inspection</span>
                        </div>
                        <p className="text-xs text-sky-950 leading-relaxed font-medium">
                          {article.lateralFlushingAndInspection}
                        </p>
                      </div>
                    )}

                    {/* 4. Signs of Trouble / Signs of Clogging */}
                    {article.signsOfClogging && article.signsOfClogging.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Signs of Clogging or Water Restriction to Spot Early</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {article.signsOfClogging.map((sign, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-950 text-xs flex items-start space-x-2"
                            >
                              <span className="font-bold text-amber-700 shrink-0">•</span>
                              <span className="leading-snug">{sign}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. What Can The Farmer Do: Practical Actionable Steps */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center space-x-1.5">
                        <Lightbulb className="w-4 h-4 text-emerald-600" />
                        <span>Practical Steps for the Farmer</span>
                      </h4>
                      <div className="space-y-2">
                        {article.whatCanFarmerDo.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-white/90 border border-gray-200/70 text-xs text-gray-800 flex items-start space-x-3 shadow-xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 6. Things to Check in the Field */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Things to Check in the Field</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-emerald-950">
                        {article.thingsToCheck.map((chk, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{chk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 7. SAFE PRACTICAL CAUTION */}
                    <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-orange-950 space-y-1">
                      <div className="flex items-center space-x-2 font-bold text-xs text-orange-900 uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                        <span>Practical Caution & Safety Guidance</span>
                      </div>
                      <p className="text-xs text-orange-950 leading-relaxed font-medium">
                        {article.importantCaution}
                      </p>
                    </div>

                    {/* 8. Action Link to Related Tool */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Next Step: </span>
                        {article.relatedTool.description}
                      </div>

                      <button
                        onClick={() => onNavigateTab(article.relatedTool.targetTab)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
                      >
                        <span>{article.relatedTool.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 9. Scientific & Extension References */}
                    {article.references && article.references.length > 0 && (
                      <div className="pt-2 text-[11px] text-gray-400 space-y-1 border-t border-gray-100">
                        <span className="font-semibold uppercase tracking-wider text-gray-500">Agricultural References:</span>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {article.references.map((ref, idx) => (
                            <span key={idx} className="italic flex items-center space-x-1">
                              <span>•</span>
                              <span>{ref}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
