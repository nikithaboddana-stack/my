import React, { useState } from 'react';
import {
  Droplets,
  Search,
  Trash2,
  Plus,
  Calendar,
  Sprout,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { WaterUsageRecord } from '../models/types';

interface WaterUsageTrackerProps {
  records: WaterUsageRecord[];
  onOpenWaterLogger: () => void;
  onDeleteRecord: (recordId: string) => Promise<void>;
  onNavigateToKnowledge: () => void;
}

export const WaterUsageTracker: React.FC<WaterUsageTrackerProps> = ({
  records,
  onOpenWaterLogger,
  onDeleteRecord,
  onNavigateToKnowledge,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cropsList = Array.from(new Set(records.map((r) => r.crop))).filter(Boolean);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.irrigationMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCrop = selectedCrop === 'ALL' || r.crop === selectedCrop;
    const matchesMethod = selectedMethod === 'ALL' || r.irrigationMethod === selectedMethod;
    return matchesSearch && matchesCrop && matchesMethod;
  });

  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this water record?')) return;
    setDeletingId(recordId);
    try {
      await onDeleteRecord(recordId);
    } finally {
      setDeletingId(null);
    }
  };

  const totalFilteredWater = filteredRecords.reduce((acc, r) => acc + (Number(r.waterUsed) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="backdrop-blur-md bg-white/70 rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg shadow-teal-500/5 relative overflow-hidden bg-linear-to-br from-teal-50/70 via-emerald-50/50 to-blue-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100/80 text-teal-800 border border-teal-200/50">
              <Droplets className="w-3.5 h-3.5" />
              <span>Actual Irrigation Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Farm Water Records
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Log how much water you apply to your crops to monitor seasonal consumption.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWaterLogger}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Water Usage</span>
            </button>
          </div>
        </div>

        {/* Interconnected link to Agronomy Library */}
        <div className="mt-4 pt-3 border-t border-teal-100/80 flex items-center justify-between text-xs text-teal-900">
          <span>Looking for techniques to reduce water loss on your plots?</span>
          <button
            onClick={onNavigateToKnowledge}
            className="font-bold text-teal-800 hover:text-teal-950 flex items-center space-x-1 cursor-pointer underline"
          >
            <span>Explore Water-Saving Guides</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* If No Records Exist */}
      {records.length === 0 ? (
        <div className="backdrop-blur-md bg-white/80 rounded-3xl border border-white/80 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-3xl">
            🌱
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-gray-900">No water usage recorded yet 🌱</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Start recording your irrigation sessions to see your actual water consumption, crop-wise breakdown, and historical logs here.
            </p>
          </div>
          <button
            onClick={onOpenWaterLogger}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record First Irrigation Session</span>
          </button>
        </div>
      ) : (
        /* Filters and Table */
        <div className="space-y-4">
          <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl border border-white/80 shadow-xs flex flex-col md:flex-row gap-3">
            <div className="relative grow">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search records by crop, method, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200/80 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-2 border border-gray-200/80 rounded-xl text-xs bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="ALL">All Crops</option>
                {cropsList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3 py-2 border border-gray-200/80 rounded-xl text-xs bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="ALL">All Methods</option>
                <option value="Drip Irrigation">Drip</option>
                <option value="Sub-surface Drip">Sub-surface Drip</option>
                <option value="Sprinkler System">Sprinkler</option>
                <option value="Furrow Irrigation">Furrow</option>
                <option value="Flood / Basin Irrigation">Flood</option>
              </select>
            </div>
          </div>

          {/* Filter summary */}
          <div className="flex items-center justify-between px-2 text-xs text-gray-500">
            <div>
              Showing <span className="font-bold text-gray-800">{filteredRecords.length}</span> of{' '}
              <span className="font-bold text-gray-800">{records.length}</span> recorded sessions
            </div>
            <div className="font-bold text-teal-800">
              Total Volume: {totalFilteredWater.toLocaleString()} Liters (~{(totalFilteredWater / 1000).toFixed(2)} m³)
            </div>
          </div>

          {/* Records Table */}
          <div className="backdrop-blur-md bg-white/85 rounded-3xl border border-white/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-teal-50/40 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Crop</th>
                    <th className="py-3.5 px-4">Water Used</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Duration & Area</th>
                    <th className="py-3.5 px-4">Notes</th>
                    <th className="py-3.5 px-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{r.date}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-bold text-gray-800">{r.crop}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-black text-gray-900">
                          {Number(r.waterUsed).toLocaleString()} <span className="text-[10px] font-normal text-gray-500">Liters</span>
                        </div>
                        <div className="text-[10px] text-teal-700 font-medium">
                          {(Number(r.waterUsed) / 1000).toFixed(2)} m³
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
                          {r.irrigationMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                        {r.durationHours !== undefined ? `${r.durationHours} hrs` : '—'}
                        {r.areaCovered !== undefined ? ` · ${r.areaCovered} ac` : ''}
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate" title={r.notes || ''}>
                        {r.notes || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={deletingId === r.id}
                          title="Delete record"
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
