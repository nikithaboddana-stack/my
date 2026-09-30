import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  Search,
  CalendarCheck,
  Plus,
  AlertTriangle,
  Lightbulb,
  CloudRain,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CROPS_DATA } from '../data/crop_knowledge';
import { CropDetail } from '../models/types';

interface CropSectionProps {
  onPlanForCrop: (cropName: string) => void;
  onRecordForCrop: (cropName: string) => void;
}

export const CropSection: React.FC<CropSectionProps> = ({
  onPlanForCrop,
  onRecordForCrop,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedCropId, setExpandedCropId] = useState<string | null>(CROPS_DATA[0].id);

  const categories = ['ALL', 'Grain', 'Vegetable', 'Commercial', 'Fruit', 'Legume'];

  const filteredCrops = CROPS_DATA.filter((crop) => {
    const matchesCat = selectedCategory === 'ALL' || crop.category === selectedCategory;
    const matchesSearch =
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.waterConsiderations.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Notice */}
      <div className="backdrop-blur-md bg-white/70 rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg shadow-emerald-500/5 relative overflow-hidden bg-linear-to-br from-emerald-50/70 via-teal-50/50 to-blue-50/40">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200/50">
            <span>🌾 Crop Intelligence & Growth Stages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Understand Crop Water Demands
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Every crop uses water differently across its growth cycle. Learn when to prioritize water and when to avoid excess watering to protect root health.
          </p>
        </div>

        {/* General Reference Disclaimer */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs flex items-center space-x-2">
          <Info className="w-4 h-4 shrink-0 text-amber-700" />
          <span>
            <strong>Reference Notice:</strong> Crop water values and stage behaviors are provided for general educational guidance. Actual farm water demands vary with weather, soil drainage, and local climate.
          </span>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl border border-white/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative grow">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search crops (e.g. Tomato, Paddy, Cotton, Wheat, Sugarcane)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200/80 rounded-xl text-xs bg-white/80 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
              }`}
            >
              {cat === 'ALL' ? 'All Crops' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCrops.map((crop) => {
          const isExpanded = expandedCropId === crop.id;

          return (
            <div
              key={crop.id}
              className={`backdrop-blur-md rounded-3xl border transition-all shadow-sm overflow-hidden ${
                isExpanded
                  ? 'bg-white/95 border-emerald-300 ring-2 ring-emerald-500/10'
                  : 'bg-white/75 hover:bg-white/90 border-white/80'
              }`}
            >
              {/* Header / Teaser */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-100/60 shadow-xs">
                      {crop.icon}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-gray-900">{crop.name}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {crop.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{crop.overview}</p>
                    </div>
                  </div>
                </div>

                {/* Suitable Methods Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {crop.suitableMethods.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-teal-50/80 text-teal-800 border border-teal-200/60"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Connected Quick Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100/80 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPlanForCrop(crop.name)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <CalendarCheck className="w-3 h-3 text-emerald-600" />
                      <span>Plan Irrigation</span>
                    </button>
                    <button
                      onClick={() => onRecordForCrop(crop.name)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3 text-teal-600" />
                      <span>Record Water</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Less' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Detailed Sections */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-slate-50/60 space-y-4 text-xs animate-in fade-in duration-150">
                  {/* Water Considerations */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 flex items-center space-x-1.5 text-xs text-blue-900">
                      <Droplets className="w-3.5 h-3.5 text-blue-600" />
                      <span>Water Considerations</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{crop.waterConsiderations}</p>
                  </div>

                  {/* Growth Stages Timeline */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 flex items-center space-x-1.5 text-xs text-emerald-900">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Growth Stages & Water Sensitivity</span>
                    </h4>
                    <div className="space-y-1.5">
                      {crop.growthStages.map((st, idx) => {
                        const isCritical = st.waterNeed === 'Critical';
                        const isHigh = st.waterNeed === 'High';
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1 ${
                              isCritical
                                ? 'bg-amber-50/80 border-amber-200/80'
                                : isHigh
                                ? 'bg-blue-50/80 border-blue-200/80'
                                : 'bg-white border-gray-100'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-gray-800">{st.stage}</div>
                              <div className="text-[11px] text-gray-600 leading-relaxed">{st.description}</div>
                            </div>
                            <span
                              className={`self-start sm:self-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                isCritical
                                  ? 'bg-amber-200 text-amber-900'
                                  : isHigh
                                  ? 'bg-blue-200 text-blue-900'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {st.waterNeed} Need
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weather / Rainfall Considerations */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 flex items-center space-x-1.5 text-xs text-sky-900">
                      <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                      <span>Weather & Rainfall Considerations</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{crop.weatherConsiderations}</p>
                  </div>

                  {/* Common Problems */}
                  <div className="space-y-1 p-3 rounded-xl bg-red-50/50 border border-red-100 text-red-950">
                    <h4 className="font-bold flex items-center space-x-1.5 text-xs text-red-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Common Water-Related Problems</span>
                    </h4>
                    <ul className="space-y-1 pl-1 pt-1">
                      {crop.commonProblems.map((pr, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5 text-[11px] text-red-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1"></span>
                          <span>{pr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Water Saving Tips */}
                  <div className="space-y-1 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-950">
                    <h4 className="font-bold flex items-center space-x-1.5 text-xs text-emerald-900">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Field Water-Saving Tips</span>
                    </h4>
                    <ul className="space-y-1 pl-1 pt-1">
                      {crop.waterSavingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5 text-[11px] text-emerald-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1"></span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
