import React, { useState } from 'react';
import { X, Droplets, Check, Loader2 } from 'lucide-react';
import { IrrigationMethod, WaterUsageRecord } from '../models/types';

interface WaterLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  defaultMethod?: IrrigationMethod;
  defaultCrop?: string;
  onSaveRecord: (record: WaterUsageRecord) => Promise<void>;
}

export const WaterLoggerModal: React.FC<WaterLoggerModalProps> = ({
  isOpen,
  onClose,
  userId,
  defaultMethod = 'Drip Irrigation',
  defaultCrop = '',
  onSaveRecord,
}) => {
  const [crop, setCrop] = useState(defaultCrop || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputVolume, setInputVolume] = useState<number | ''>('');
  const [unit, setUnit] = useState<'Liters' | 'Gallons' | 'Cubic Meters (m³)'>('Liters');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>(defaultMethod);
  const [durationHours, setDurationHours] = useState<number | ''>('');
  const [areaCovered, setAreaCovered] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Convert input unit to canonical liters
  const canonicalLiters = inputVolume
    ? Math.round(
        unit === 'Gallons'
          ? Number(inputVolume) * 3.78541
          : unit === 'Cubic Meters (m³)'
          ? Number(inputVolume) * 1000
          : Number(inputVolume)
      )
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim()) {
      setErrorMsg('Please enter the crop name.');
      return;
    }
    if (!inputVolume || Number(inputVolume) <= 0) {
      setErrorMsg('Please enter a valid water volume.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const newRecord: WaterUsageRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        crop: crop.trim(),
        date,
        waterUsed: canonicalLiters,
        unit,
        irrigationMethod,
        createdAt: new Date().toISOString(),
      };

      if (durationHours !== '' && !isNaN(Number(durationHours))) {
        newRecord.durationHours = Number(durationHours);
      }
      if (areaCovered !== '' && !isNaN(Number(areaCovered))) {
        newRecord.areaCovered = Number(areaCovered);
      }
      if (notes.trim()) {
        newRecord.notes = notes.trim();
      }

      await onSaveRecord(newRecord);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to record water usage.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-white/80 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-teal-100/80 text-teal-800">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Record Water Usage</h2>
              <p className="text-xs text-gray-500">Add an actual irrigation session to your farm water records</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Crop *</label>
              <input
                type="text"
                required
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Wheat, Tomato, Paddy"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Water Amount Applied *</label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={inputVolume}
                onChange={(e) => setInputVolume(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g. 5000"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'Liters' | 'Gallons' | 'Cubic Meters (m³)')}
                className="w-full px-2 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Liters">Liters</option>
                <option value="Cubic Meters (m³)">Cubic Meters (m³)</option>
                <option value="Gallons">Gallons</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Irrigation Method Used</label>
            <select
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              <option value="Drip Irrigation">Drip Irrigation</option>
              <option value="Sub-surface Drip">Sub-surface Drip</option>
              <option value="Sprinkler System">Sprinkler System</option>
              <option value="Furrow Irrigation">Furrow Irrigation</option>
              <option value="Flood / Basin Irrigation">Flood / Basin Irrigation</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Hours, Optional)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g. 2"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Area Covered (Acres, Optional)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={areaCovered}
                onChange={(e) => setAreaCovered(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g. 1.5"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Morning watering; soil was dry; lateral lines checked"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {canonicalLiters > 0 && (
            <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-100/80 text-teal-900 text-xs flex items-center justify-between">
              <span>Recorded Volume: <strong>{canonicalLiters.toLocaleString()} Liters</strong></span>
              <span className="text-[11px] text-teal-700">~{(canonicalLiters / 1000).toFixed(2)} m³</span>
            </div>
          )}

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
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
