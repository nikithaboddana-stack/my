import { FarmDetails, IrrigationMethod, WaterUsageRecord } from '../models/types';

export interface WaterAnalytics {
  hasRecords: boolean;
  hasSufficientData: boolean;
  totalWaterLiters: number;
  totalWaterM3: number;
  thisWeekLiters: number;
  thisMonthLiters: number;
  avgDailyLiters: number;
  cropBreakdown: { crop: string; liters: number; percentage: number }[];
  methodBreakdown: { method: IrrigationMethod; liters: number; percentage: number }[];
  dailyTimeline: { date: string; liters: number }[];
}

export function calculateWaterAnalytics(
  records: WaterUsageRecord[],
  farm: FarmDetails | null
): WaterAnalytics {
  if (!records || records.length === 0) {
    return {
      hasRecords: false,
      hasSufficientData: false,
      totalWaterLiters: 0,
      totalWaterM3: 0,
      thisWeekLiters: 0,
      thisMonthLiters: 0,
      avgDailyLiters: 0,
      cropBreakdown: [],
      methodBreakdown: [],
      dailyTimeline: [],
    };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let totalLiters = 0;
  let thisWeekLiters = 0;
  let thisMonthLiters = 0;

  const cropMap: Record<string, number> = {};
  const methodMap: Record<string, number> = {};
  const dateMap: Record<string, number> = {};

  records.forEach((r) => {
    const liters = Number(r.waterUsed) || 0;
    totalLiters += liters;

    const recordDate = new Date(r.date);
    if (!isNaN(recordDate.getTime())) {
      if (recordDate >= sevenDaysAgo) {
        thisWeekLiters += liters;
      }
      if (recordDate >= thirtyDaysAgo) {
        thisMonthLiters += liters;
      }
      // Group by date
      dateMap[r.date] = (dateMap[r.date] || 0) + liters;
    }

    if (r.crop) {
      cropMap[r.crop] = (cropMap[r.crop] || 0) + liters;
    }
    if (r.irrigationMethod) {
      methodMap[r.irrigationMethod] = (methodMap[r.irrigationMethod] || 0) + liters;
    }
  });

  const uniqueDatesCount = Object.keys(dateMap).length || 1;
  const avgDailyLiters = Math.round(totalLiters / uniqueDatesCount);

  const cropBreakdown = Object.entries(cropMap)
    .map(([crop, liters]) => ({
      crop,
      liters,
      percentage: totalLiters > 0 ? Math.round((liters / totalLiters) * 100) : 0,
    }))
    .sort((a, b) => b.liters - a.liters);

  const methodBreakdown = Object.entries(methodMap)
    .map(([method, liters]) => ({
      method: method as IrrigationMethod,
      liters,
      percentage: totalLiters > 0 ? Math.round((liters / totalLiters) * 100) : 0,
    }))
    .sort((a, b) => b.liters - a.liters);

  const dailyTimeline = Object.entries(dateMap)
    .map(([date, liters]) => ({ date, liters }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14);

  return {
    hasRecords: true,
    hasSufficientData: records.length >= 3,
    totalWaterLiters: Math.round(totalLiters),
    totalWaterM3: Number((totalLiters / 1000).toFixed(2)),
    thisWeekLiters: Math.round(thisWeekLiters),
    thisMonthLiters: Math.round(thisMonthLiters),
    avgDailyLiters,
    cropBreakdown,
    methodBreakdown,
    dailyTimeline,
  };
}
