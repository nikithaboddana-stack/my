import React, { useState } from 'react';
import { X, MapPin, Search, Sprout, Check, Loader2, Info } from 'lucide-react';
import { FarmDetails, IrrigationMethod, SoilType, WaterSource } from '../models/types';
import { GeocodingResult, WeatherApiService } from '../services/weather_api_service';

interface FarmSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  existingFarm: FarmDetails | null;
  onSave: (farm: FarmDetails) => Promise<void>;
}

export const FarmSetupModal: React.FC<FarmSetupModalProps> = ({
  isOpen,
  onClose,
  userId,
  existingFarm,
  onSave,
}) => {
  const [farmName, setFarmName] = useState(existingFarm?.farmName || '');
  const [farmArea, setFarmArea] = useState<number | ''>(existingFarm?.farmArea ?? '');
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares' | 'm²'>(existingFarm?.areaUnit || 'acres');
  const [soilType, setSoilType] = useState<SoilType | ''>(existingFarm?.soilType || '');
  const [crops, setCrops] = useState(existingFarm?.crops || '');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod | ''>(
    existingFarm?.irrigationMethod || ''
  );
  const [waterSource, setWaterSource] = useState<WaterSource | ''>(
    existingFarm?.waterSource || ''
  );
  const [cityName, setCityName] = useState(existingFarm?.cityName || '');
  const [latitude, setLatitude] = useState<number | undefined>(existingFarm?.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(existingFarm?.longitude);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCitySearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setErrorMsg(null);
    try {
      const results = await WeatherApiService.searchLocations(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setErrorMsg('No location matches found. Please try another city, town, or district name.');
      }
    } catch {
      setErrorMsg('Failed to search locations. Check network connection.');
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (res: GeocodingResult) => {
    const displayName = `${res.name}${res.admin1 ? ', ' + res.admin1 : ''}${res.country ? ', ' + res.country : ''}`;
    setCityName(displayName);
    setLatitude(res.latitude);
    setLongitude(res.longitude);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setErrorMsg(null);
    try {
      const updatedFarm: FarmDetails = {
        userId,
        farmName: farmName.trim() || 'My Farm',
        updatedAt: new Date().toISOString(),
      };

      if (farmArea !== '' && !isNaN(Number(farmArea))) {
        updatedFarm.farmArea = Number(farmArea);
        updatedFarm.areaUnit = areaUnit;
      }
      if (soilType) updatedFarm.soilType = soilType;
      if (crops.trim()) updatedFarm.crops = crops.trim();
      if (irrigationMethod) updatedFarm.irrigationMethod = irrigationMethod;
      if (waterSource) updatedFarm.waterSource = waterSource;
      if (latitude !== undefined) updatedFarm.latitude = latitude;
      if (longitude !== undefined) updatedFarm.longitude = longitude;
      if (cityName) updatedFarm.cityName = cityName;

      await onSave(updatedFarm);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to synchronize farm profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/80 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-emerald-100/80 text-emerald-800">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {existingFarm ? 'Your Farm Profile (Optional)' : 'Farm Profile (Optional)'}
              </h2>
              <p className="text-xs text-gray-500">
                Personalize your experience. You can use all features without filling this out.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Name</label>
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. Sunny Brook Farm (or leave blank)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Total Farm Area (Optional)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={farmArea}
                onChange={(e) => setFarmArea(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g. 5"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as 'acres' | 'hectares' | 'm²')}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="m²">Square Meters (m²)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Soil Type (Optional)</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="">Select soil type (if known)</option>
                <option value="Loam">Loam (Balanced drainage & retention)</option>
                <option value="Clay">Clay (High water holding)</option>
                <option value="Sandy">Sandy (High infiltration, fast drying)</option>
                <option value="Silt">Silt (Fine texture)</option>
                <option value="Peat">Peat (High organic matter)</option>
                <option value="Saline">Saline soil</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Irrigation (Optional)</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="">Select primary method</option>
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sub-surface Drip">Sub-surface Drip</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Furrow Irrigation">Furrow Irrigation</option>
                <option value="Flood / Basin Irrigation">Flood / Basin Irrigation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Water Source (Optional)</label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value as WaterSource)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="">Select water source</option>
                <option value="Borewell / Groundwater">Borewell / Groundwater</option>
                <option value="Canal / Irrigation Network">Canal / Irrigation Network</option>
                <option value="River / Stream">River / Stream</option>
                <option value="Rainwater Harvesting Pond">Rainwater Harvesting Pond</option>
                <option value="Municipal / Tanker Supply">Municipal / Tanker Supply</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Crops Grown</label>
              <input
                type="text"
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="e.g. Wheat, Tomato, Cotton"
              />
            </div>
          </div>

          {/* Farm Location Selection (Completely clean with NO hardcoded default city) */}
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Farm Meteorological Location (Optional)</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-medium">Used for live weather</span>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCitySearch();
                  }
                }}
                placeholder="Search your village, town, or district..."
                className="grow px-3 py-1.5 border border-emerald-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCitySearch}
                disabled={searching}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-white rounded-xl border border-emerald-200 divide-y divide-gray-100 max-h-36 overflow-y-auto shadow-sm">
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => selectLocation(res)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-gray-800">
                      {res.name} {res.admin1 && `(${res.admin1})`}, {res.country}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}

            {cityName ? (
              <div className="flex items-center justify-between text-xs text-emerald-900 bg-white/90 p-2 rounded-xl border border-emerald-100">
                <div>
                  <span className="font-bold text-gray-700">Selected Location: </span>
                  <span className="font-semibold text-emerald-800">{cityName}</span>
                </div>
                {latitude !== undefined && longitude !== undefined && (
                  <div className="text-[11px] text-gray-400 font-mono">
                    {latitude.toFixed(2)}°, {longitude.toFixed(2)}°
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 italic">No location selected yet.</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Farm Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
