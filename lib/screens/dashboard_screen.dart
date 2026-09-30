import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../data/agronomy_knowledge.dart';
import '../models/types.dart';
import '../services/firebase_service.dart';
import '../theme/app_theme.dart';
import '../utils/water_calc.dart';
import '../widgets/farm_setup_dialog.dart';
import '../widgets/water_logger_dialog.dart';

class DashboardScreen extends StatelessWidget {
  final FarmDetails? farm;
  final WaterAnalytics analytics;
  final List<WaterUsageRecord> records;
  final List<IrrigationSchedule> schedules;
  final WeatherReport? weather;
  final bool weatherLoading;
  final VoidCallback onRefreshWeather;
  final Function(int) onNavigateTab;
  final String userId;

  const DashboardScreen({
    super.key,
    required this.farm,
    required this.analytics,
    required this.records,
    required this.schedules,
    required this.weather,
    required this.weatherLoading,
    required this.onRefreshWeather,
    required this.onNavigateTab,
    required this.userId,
  });

  String _getTimeGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    final pendingSchedules = schedules.where((s) => s.status == 'pending').toList();
    final featuredGuides = kAgronomyArticles.take(2).toList();
    final greeting = _getTimeGreeting();
    final farmTitle = (farm?.farmName != null && farm!.farmName.isNotEmpty) ? farm!.farmName : 'Farmer';

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. TOP HERO BANNER
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: AppColors.heroGradient,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.9)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.emerald700.withValues(alpha: 0.06),
                      blurRadius: 18,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.emerald100),
                      ),
                      child: Text(
                        '🌾 $greeting, $farmTitle',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.emerald800,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      '🌱 Welcome to AgriFlow',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        color: AppColors.gray900,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Manage water. Understand your crops. Make better irrigation decisions.',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: AppColors.gray700,
                      ),
                    ),
                    const SizedBox(height: 18),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (_) => WaterLoggerDialog(
                                userId: userId,
                                defaultCrop: farm?.crops?.split(',').first.trim(),
                                defaultMethod: farm?.irrigationMethod,
                              ),
                            );
                          },
                          icon: const Icon(Icons.water_drop, size: 18),
                          label: const Text('+ Log Water'),
                        ),
                        OutlinedButton.icon(
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (_) => FarmSetupDialog(
                                userId: userId,
                                existingFarm: farm,
                              ),
                            );
                          },
                          icon: const Icon(Icons.settings_outlined, size: 18),
                          label: const Text('Farm Profile'),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: Colors.white.withValues(alpha: 0.8),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                        ),
                        ElevatedButton.icon(
                          onPressed: () => onNavigateTab(5), // AI Assistant
                          icon: const Icon(Icons.smart_toy_outlined, size: 18),
                          label: const Text('Ask AI Assistant'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.teal700,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 2. METRIC CARDS ROW
              LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth > 650;
                  final width = isWide ? (constraints.maxWidth - 36) / 4 : (constraints.maxWidth - 12) / 2;

                  return Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildMetricCard(
                        width: width,
                        title: 'Total Water Used',
                        value: analytics.hasRecords
                            ? '${NumberFormat('#,###').format(analytics.totalWaterLiters)} L'
                            : '0 L',
                        subtitle: analytics.hasRecords ? '${analytics.totalWaterM3} m³' : 'No records yet',
                        icon: Icons.opacity,
                        iconColor: AppColors.emerald700,
                        bgColor: AppColors.emerald50,
                      ),
                      _buildMetricCard(
                        width: width,
                        title: 'This Week',
                        value: '${NumberFormat('#,###').format(analytics.thisWeekLiters)} L',
                        subtitle: 'Last 7 days',
                        icon: Icons.calendar_view_week,
                        iconColor: AppColors.teal700,
                        bgColor: AppColors.teal50,
                      ),
                      _buildMetricCard(
                        width: width,
                        title: 'Daily Average',
                        value: '${NumberFormat('#,###').format(analytics.avgDailyLiters.round())} L',
                        subtitle: 'Per active day',
                        icon: Icons.trending_up,
                        iconColor: AppColors.sky700,
                        bgColor: AppColors.sky50,
                      ),
                      _buildMetricCard(
                        width: width,
                        title: 'Pending Irrigations',
                        value: '${pendingSchedules.length}',
                        subtitle: pendingSchedules.isNotEmpty ? 'Upcoming runs' : 'All clear',
                        icon: Icons.schedule,
                        iconColor: AppColors.amber700,
                        bgColor: AppColors.amber50,
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 20),

              // 3. LIVE WEATHER BANNER
              _buildWeatherBanner(context),
              const SizedBox(height: 20),

              // 4. WATER CONSUMPTION TIMELINE
              if (analytics.hasRecords && analytics.dailyTimeline.isNotEmpty) ...[
                _buildTimelineCard(),
                const SizedBox(height: 20),
              ],

              // 5. QUICK NAVIGATION GRID
              const Text(
                'Explore Farm Tools',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.gray900),
              ),
              const SizedBox(height: 12),
              LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth > 700;
                  final width = isWide ? (constraints.maxWidth - 24) / 3 : constraints.maxWidth;

                  return Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildToolCard(
                        width: width,
                        icon: '💧',
                        title: 'Water Logs',
                        desc: 'Track daily irrigation volume across drip, flood, and sprinklers.',
                        onTap: () => onNavigateTab(2),
                      ),
                      _buildToolCard(
                        width: width,
                        icon: '📅',
                        title: 'Irrigation Planner',
                        desc: 'Schedule upcoming watering cycles with live weather conflict alerts.',
                        onTap: () => onNavigateTab(3),
                      ),
                      _buildToolCard(
                        width: width,
                        icon: '🌾',
                        title: 'Crop Information',
                        desc: 'Growth stages, Kc coefficients, and water benchmarks for 10+ crops.',
                        onTap: () => onNavigateTab(1),
                      ),
                      _buildToolCard(
                        width: width,
                        icon: '📚',
                        title: 'Agronomy Library',
                        desc: 'Problem-oriented guides on drip clogs, soil AWC, ETc, and mulching.',
                        onTap: () => onNavigateTab(7),
                      ),
                      _buildToolCard(
                        width: width,
                        icon: '🤖',
                        title: 'AgriFlow Assistant',
                        desc: 'Ask real agronomy questions grounded in your actual farm records.',
                        onTap: () => onNavigateTab(5),
                      ),
                      _buildToolCard(
                        width: width,
                        icon: '❓',
                        title: 'Farmer Help Desk',
                        desc: 'Post specific questions and receive verified extension guidance.',
                        onTap: () => onNavigateTab(6),
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 24),

              // 6. UPCOMING SCHEDULES & FEATURED GUIDES
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Upcoming Irrigation',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
                            ),
                            TextButton(
                              onPressed: () => onNavigateTab(3),
                              child: const Text('View All'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        if (pendingSchedules.isEmpty)
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.gray200),
                            ),
                            child: const Center(
                              child: Text(
                                'No pending schedules. Use Irrigation Planner to set one.',
                                style: TextStyle(fontSize: 13, color: AppColors.gray500),
                              ),
                            ),
                          )
                        else
                          ...pendingSchedules.take(3).map((s) => _buildScheduleItem(context, s)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // 7. FEATURED GUIDES
              Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Featured Agronomy Guides',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
                      ),
                      TextButton(
                        onPressed: () => onNavigateTab(7),
                        child: const Text('Open Library'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ...featuredGuides.map((g) => _buildGuideItem(g)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required double width,
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
  }) {
    return Container(
      width: width,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.gray200.withValues(alpha: 0.8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.gray600),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
                child: Icon(icon, size: 16, color: iconColor),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.gray900),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 11, color: AppColors.gray500),
          ),
        ],
      ),
    );
  }

  Widget _buildWeatherBanner(BuildContext context) {
    if (weatherLoading) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppColors.gray200),
        ),
        child: const Center(
          child: Column(
            children: [
              CircularProgressIndicator(strokeWidth: 2),
              SizedBox(height: 10),
              Text('Fetching live Open-Meteo weather...', style: TextStyle(fontSize: 12, color: AppColors.gray600)),
            ],
          ),
        ),
      );
    }

    if (weather == null) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.amber50.withValues(alpha: 0.7),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppColors.amber500.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(Icons.location_off, color: AppColors.amber700, size: 24),
            ),
            const SizedBox(width: 16),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Farm Location Not Configured',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.amber700),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Set your farm city to load live weather, rain probability, and irrigation advisories.',
                    style: TextStyle(fontSize: 12, color: AppColors.gray700),
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (_) => FarmSetupDialog(userId: userId, existingFarm: farm),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.amber700,
              ),
              child: const Text('Set Location'),
            ),
          ],
        ),
      );
    }

    final cur = weather!.current;
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.sky500.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: AppColors.sky500.withValues(alpha: 0.04),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.cloud_queue, color: AppColors.sky700, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'Live Weather · ${weather!.city}',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.gray900),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.refresh, size: 18, color: AppColors.gray500),
                onPressed: onRefreshWeather,
                tooltip: 'Refresh Weather',
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Text(
                '${cur.temperature}°C',
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.gray900),
              ),
              const SizedBox(width: 14),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(cur.weatherDescription,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.gray800)),
                  Text('Rain Prob: ${cur.rainProbability}% · Humidity: ${cur.humidity}% · Wind: ${cur.windSpeed} km/h',
                      style: const TextStyle(fontSize: 11, color: AppColors.gray600)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.emerald50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.emerald100),
            ),
            child: Row(
              children: [
                const Icon(Icons.lightbulb_outline, size: 18, color: AppColors.emerald700),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    weather!.agriAdvice,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.emerald900),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Water Usage History (Liters)',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.gray900),
          ),
          const SizedBox(height: 14),
          SizedBox(
            height: 120,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: analytics.dailyTimeline.map((item) {
                final maxLiters = analytics.dailyTimeline
                    .map((e) => e.liters)
                    .reduce((a, b) => a > b ? a : b);
                final heightFactor = maxLiters > 0 ? (item.liters / maxLiters) : 0.0;

                return Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        '${(item.liters / 1000).toStringAsFixed(1)}k',
                        style: const TextStyle(fontSize: 9, color: AppColors.gray500),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        height: 70 * heightFactor + 6,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          gradient: AppColors.primaryGradient,
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.date.length >= 5 ? item.date.substring(5) : item.date,
                        style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: AppColors.gray600),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToolCard({
    required double width,
    required String icon,
    required String title,
    required String desc,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(22),
      child: Container(
        width: width,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.gray200),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.gray50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(icon, style: const TextStyle(fontSize: 22)),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                  const SizedBox(height: 3),
                  Text(desc, style: const TextStyle(fontSize: 11, color: AppColors.gray600), maxLines: 2, overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.gray400, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildScheduleItem(BuildContext context, IrrigationSchedule s) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.amber50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.water_drop_outlined, size: 18, color: AppColors.amber700),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${s.crop} · ${s.scheduledDate}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                Text(
                  '${s.plannedWater != null ? "${s.plannedWater}L" : "Standard"} via ${s.irrigationMethod ?? "Drip"}',
                  style: const TextStyle(fontSize: 11, color: AppColors.gray600),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              await FirebaseService().updateScheduleStatus(s.userId, s.id, 'completed');
            },
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              textStyle: const TextStyle(fontSize: 11),
            ),
            child: const Text('Complete'),
          ),
        ],
      ),
    );
  }

  Widget _buildGuideItem(KnowledgeArticle g) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.emerald50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.menu_book, size: 18, color: AppColors.emerald700),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(g.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                Text('${g.category} · ${g.readTime}', style: const TextStyle(fontSize: 11, color: AppColors.gray500)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.gray400, size: 20),
        ],
      ),
    );
  }
}
