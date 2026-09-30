import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  AlertCircle,
  CheckCircle,
  CloudRain,
  Trash2,
  Sprout,
  X,
  Droplets,
  CalendarCheck,
  Info,
} from 'lucide-react';
import { IrrigationMethod, IrrigationSchedule, WeatherReport } from '../models/types';

interface IrrigationPlannerProps {
  schedules: IrrigationSchedule[];
  weather: WeatherReport | null;
  onAddSchedule: (schedule: IrrigationSchedule) => Promise<void>;
  onUpdateStatus: (scheduleId: string, status: IrrigationSchedule['status']) => Promise<void>;
  onDeleteSchedule: (scheduleId: string) => Promise<void>;
  userId: string;
  defaultCrop?: string;
}

export const IrrigationPlanner: React.FC<IrrigationPlannerProps> = ({
  schedules,
  weather,
  onAddSchedule,
  onUpdateStatus,
  onDeleteSchedule,
  userId,
  defaultCrop = '',
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [crop, setCrop] = useState(defaultCrop || '');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('06:00 AM');
  const [plannedWater, setPlannedWater] = useState<number | ''>('');
  const [durationHours, setDurationHours] = useState<number | ''>('');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>('Drip Irrigation');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cross-reference live weather ONLY if real weather exists
  const hasLiveWeather = weather && weather.isLive && weather.forecast.length > 0;
  const matchedForecast = hasLiveWeather ? weather.forecast.find((f) => f.date === scheduledDate) : null;
  const hasRainAlert =
    matchedForecast && (matchedForecast.precipitationProbability >= 45 || matchedForecast.precipitationSum >= 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim() || !scheduledDate) return;

    setSubmitting(true);
    try {
      let rainAdvisory: string | undefined = undefined;
      if (hasLiveWeather && matchedForecast && matchedForecast.precipitationProbability >= 45) {
        rainAdvisory = `Rain forecasted on this day (${matchedForecast.precipitationProbability}% chance, ${matchedForecast.precipitationSum} mm). Consider holding off to save water.`;
      } else if (!hasLiveWeather) {
        rainAdvisory = 'Weather information unavailable. Your irrigation schedule has still been saved.';
      }

      const newSchedule: IrrigationSchedule = {
        id: `sched_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        crop: crop.trim(),
        scheduledDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (scheduledTime) newSchedule.scheduledTime = scheduledTime;
      if (plannedWater !== '' && !isNaN(Number(plannedWater))) newSchedule.plannedWater = Number(plannedWater);
      if (durationHours !== '' && !isNaN(Number(durationHours))) newSchedule.durationHours = Number(durationHours);
      if (irrigationMethod) newSchedule.irrigationMethod = irrigationMethod;
      if (notes.trim()) newSchedule.notes = notes.trim();
      if (rainAdvisory) newSchedule.weatherAlert = rainAdvisory;

      await onAddSchedule(newSchedule);
      setShowAddForm(false);
      setCrop(defaultCrop || '');
      setPlannedWater('');
      setDurationHours('');
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingSchedules = schedules.filter((s) => s.status === 'pending');
  const pastSchedules = schedules.filter((s) => s.status !== 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="backdrop-blur-md bg-white/70 rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg shadow-amber-500/5 relative overflow-hidden bg-linear-to-br from-amber-50/70 via-orange-50/50 to-yellow-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-800 border border-amber-200/50">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Irrigation Scheduling</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Irrigation Planner
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Plan upcoming watering cycles to stay ahead of crop moisture needs.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Schedule New Irrigation'}</span>
          </button>
        </div>
      </div>

      {/* Add Schedule Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/90 p-6 rounded-3xl border border-amber-200/80 shadow-md space-y-4 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Schedule Next Irrigation Cycle</span>
            </h3>
            <span className="text-[11px] text-gray-400">Saved to your farm records</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Crop *</label>
              <input
                type="text"
                required
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Tomato, Wheat, Maize"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Date *</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Planned Start Time</label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. 06:00 AM"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Hours, Optional)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g. 2.5"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Water (Liters, Optional)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={plannedWater}
                onChange={(e) => setPlannedWater(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g. 8000"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Irrigation Method</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sub-surface Drip">Sub-surface Drip</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Furrow Irrigation">Furrow Irrigation</option>
                <option value="Flood / Basin Irrigation">Flood / Basin Irrigation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Focus on flowering plots; check filter first"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Genuine Weather Advisory: only if real weather exists, else note */}
          {hasLiveWeather && hasRainAlert && matchedForecast ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-2.5 text-blue-900 text-xs">
              <CloudRain className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Weather Rain Forecast: </span>
                <span>
                  The weather station indicates a <strong>{matchedForecast.precipitationProbability}% chance of rain</strong> on {scheduledDate}.
                  Delaying this schedule can help save groundwater and pumping power.
                </span>
              </div>
            </div>
          ) : !hasLiveWeather ? (
            <div className="p-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-gray-600 text-xs flex items-center space-x-2">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Weather information unavailable for this location. Your irrigation schedule will still be saved cleanly.</span>
            </div>
          ) : null}

          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        </form>
      )}

      {/* Schedules List */}
      {schedules.length === 0 ? (
        <div className="backdrop-blur-md bg-white/80 rounded-3xl border border-white/80 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-3xl">
            📅
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-gray-900">No irrigation cycles scheduled</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Plan your upcoming irrigation sessions to stay on top of crop water needs and prevent over-irrigation.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Schedule</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Upcoming Scheduled Irrigations ({upcomingSchedules.length})</span>
            </h3>

            {upcomingSchedules.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-white/60 p-4 rounded-2xl border border-white/80">
                No pending irrigation cycles. Tap "Schedule New Irrigation" to plan ahead.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSchedules.map((item) => (
                  <div
                    key={item.id}
                    className="backdrop-blur-md bg-white/85 p-5 rounded-3xl border border-white/80 shadow-xs space-y-3 hover:border-amber-200 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-2xl bg-amber-50 text-amber-700">
                          <Sprout className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-gray-900">{item.crop}</h4>
                          <div className="text-xs text-gray-500 flex items-center space-x-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{item.scheduledDate}</span>
                            {item.scheduledTime && <span>· {item.scheduledTime}</span>}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                        Scheduled
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                      {item.irrigationMethod && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {item.irrigationMethod}
                        </span>
                      )}
                      {item.plannedWater && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800">
                          Target: {item.plannedWater.toLocaleString()} L
                        </span>
                      )}
                      {item.durationHours && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800">
                          {item.durationHours} hrs
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-xs text-gray-500 italic bg-gray-50/70 p-2 rounded-xl">
                        "{item.notes}"
                      </p>
                    )}

                    {item.weatherAlert && (
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-[11px] flex items-start space-x-2">
                        <CloudRain className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item.weatherAlert}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateStatus(item.id, 'completed')}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          ✓ Mark Completed
                        </button>
                        <button
                          onClick={() => onUpdateStatus(item.id, 'skipped_weather')}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          🌧️ Skip (Rain)
                        </button>
                      </div>

                      <button
                        onClick={() => onDeleteSchedule(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past / Completed Section */}
          {pastSchedules.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-200/80">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Completed & Past Events ({pastSchedules.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pastSchedules.map((item) => (
                  <div
                    key={item.id}
                    className="backdrop-blur-md bg-white/60 p-4 rounded-2xl border border-white/60 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-gray-800">{item.crop} — {item.scheduledDate}</div>
                      <div className="text-[11px] text-gray-500">{item.irrigationMethod || 'Standard'}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'skipped_weather'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => onDeleteSchedule(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
