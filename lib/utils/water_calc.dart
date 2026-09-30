import '../models/types.dart';

class CropUsageBreakdown {
  final String crop;
  final double liters;
  final int percentage;

  CropUsageBreakdown({
    required this.crop,
    required this.liters,
    required this.percentage,
  });
}

class MethodUsageBreakdown {
  final String method;
  final double liters;
  final int percentage;

  MethodUsageBreakdown({
    required this.method,
    required this.liters,
    required this.percentage,
  });
}

class DailyUsagePoint {
  final String date;
  final double liters;

  DailyUsagePoint({
    required this.date,
    required this.liters,
  });
}

class WaterAnalytics {
  final bool hasRecords;
  final bool hasSufficientData;
  final double totalWaterLiters;
  final double totalWaterM3;
  final double thisWeekLiters;
  final double thisMonthLiters;
  final double avgDailyLiters;
  final List<CropUsageBreakdown> cropBreakdown;
  final List<MethodUsageBreakdown> methodBreakdown;
  final List<DailyUsagePoint> dailyTimeline;

  WaterAnalytics({
    required this.hasRecords,
    required this.hasSufficientData,
    required this.totalWaterLiters,
    required this.totalWaterM3,
    required this.thisWeekLiters,
    required this.thisMonthLiters,
    required this.avgDailyLiters,
    required this.cropBreakdown,
    required this.methodBreakdown,
    required this.dailyTimeline,
  });

  factory WaterAnalytics.empty() {
    return WaterAnalytics(
      hasRecords: false,
      hasSufficientData: false,
      totalWaterLiters: 0.0,
      totalWaterM3: 0.0,
      thisWeekLiters: 0.0,
      thisMonthLiters: 0.0,
      avgDailyLiters: 0.0,
      cropBreakdown: [],
      methodBreakdown: [],
      dailyTimeline: [],
    );
  }
}

WaterAnalytics calculateWaterAnalytics(
  List<WaterUsageRecord> records,
  FarmDetails? farm,
) {
  if (records.isEmpty) {
    return WaterAnalytics.empty();
  }

  final now = DateTime.now();
  final sevenDaysAgo = now.subtract(const Duration(days: 7));
  final thirtyDaysAgo = now.subtract(const Duration(days: 30));

  double totalLiters = 0.0;
  double thisWeekLiters = 0.0;
  double thisMonthLiters = 0.0;

  final Map<String, double> cropMap = {};
  final Map<String, double> methodMap = {};
  final Map<String, double> dateMap = {};

  for (final r in records) {
    final liters = r.waterUsed;
    totalLiters += liters;

    final parsedDate = DateTime.tryParse(r.date);
    if (parsedDate != null) {
      if (parsedDate.isAfter(sevenDaysAgo) || parsedDate.isAtSameMomentAs(sevenDaysAgo)) {
        thisWeekLiters += liters;
      }
      if (parsedDate.isAfter(thirtyDaysAgo) || parsedDate.isAtSameMomentAs(thirtyDaysAgo)) {
        thisMonthLiters += liters;
      }
      dateMap[r.date] = (dateMap[r.date] ?? 0.0) + liters;
    } else {
      dateMap[r.date] = (dateMap[r.date] ?? 0.0) + liters;
    }

    if (r.crop.isNotEmpty) {
      cropMap[r.crop] = (cropMap[r.crop] ?? 0.0) + liters;
    }
    if (r.irrigationMethod.isNotEmpty) {
      methodMap[r.irrigationMethod] = (methodMap[r.irrigationMethod] ?? 0.0) + liters;
    }
  }

  final uniqueDatesCount = dateMap.keys.length > 0 ? dateMap.keys.length : 1;
  final avgDailyLiters = totalLiters / uniqueDatesCount;

  final cropBreakdown = cropMap.entries.map((e) {
    return CropUsageBreakdown(
      crop: e.key,
      liters: e.value,
      percentage: totalLiters > 0 ? ((e.value / totalLiters) * 100).round() : 0,
    );
  }).toList()
    ..sort((a, b) => b.liters.compareTo(a.liters));

  final methodBreakdown = methodMap.entries.map((e) {
    return MethodUsageBreakdown(
      method: e.key,
      liters: e.value,
      percentage: totalLiters > 0 ? ((e.value / totalLiters) * 100).round() : 0,
    );
  }).toList()
    ..sort((a, b) => b.liters.compareTo(a.liters));

  final sortedDates = dateMap.entries.map((e) {
    return DailyUsagePoint(date: e.key, liters: e.value);
  }).toList()
    ..sort((a, b) {
      final da = DateTime.tryParse(a.date) ?? DateTime.fromMillisecondsSinceEpoch(0);
      final db = DateTime.tryParse(b.date) ?? DateTime.fromMillisecondsSinceEpoch(0);
      return da.compareTo(db);
    });

  final dailyTimeline = sortedDates.length > 14
      ? sortedDates.sublist(sortedDates.length - 14)
      : sortedDates;

  return WaterAnalytics(
    hasRecords: true,
    hasSufficientData: records.length >= 3,
    totalWaterLiters: totalLiters,
    totalWaterM3: double.parse((totalLiters / 1000).toStringAsFixed(2)),
    thisWeekLiters: thisWeekLiters,
    thisMonthLiters: thisMonthLiters,
    avgDailyLiters: avgDailyLiters,
    cropBreakdown: cropBreakdown,
    methodBreakdown: methodBreakdown,
    dailyTimeline: dailyTimeline,
  );
}
