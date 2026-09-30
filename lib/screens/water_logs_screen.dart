import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/types.dart';
import '../services/firebase_service.dart';
import '../theme/app_theme.dart';
import '../utils/water_calc.dart';
import '../widgets/water_logger_dialog.dart';

class WaterLogsScreen extends StatefulWidget {
  final List<WaterUsageRecord> records;
  final String userId;
  final VoidCallback onNavigateToKnowledge;

  const WaterLogsScreen({
    super.key,
    required this.records,
    required this.userId,
    required this.onNavigateToKnowledge,
  });

  @override
  State<WaterLogsScreen> createState() => _WaterLogsScreenState();
}

class _WaterLogsScreenState extends State<WaterLogsScreen> {
  String _selectedCropFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final cropsList = ['All', ...{...widget.records.map((r) => r.crop)}];
    final filteredRecords = _selectedCropFilter == 'All'
        ? widget.records
        : widget.records.where((r) => r.crop == _selectedCropFilter).toList();

    final analytics = calculateWaterAnalytics(widget.records, null);

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header Banner
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  gradient: AppColors.heroGradient,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            '💧 Water Usage Records',
                            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.gray900),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Log real irrigation volumes to track crop consumption and optimize pump hours.',
                            style: TextStyle(fontSize: 13, color: AppColors.gray700),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (_) => WaterLoggerDialog(userId: widget.userId),
                        );
                      },
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text('+ Log Usage'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.emerald700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Summary Metrics
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Total Recorded',
                      '${NumberFormat('#,###').format(analytics.totalWaterLiters)} L',
                      '${analytics.totalWaterM3} m³ volume',
                      AppColors.emerald700,
                      AppColors.emerald50,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildStatCard(
                      'Recorded Logs',
                      '${widget.records.length}',
                      'Individual runs',
                      AppColors.teal700,
                      AppColors.teal50,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildStatCard(
                      'Daily Average',
                      '${NumberFormat('#,###').format(analytics.avgDailyLiters.round())} L',
                      'Per active day',
                      AppColors.sky700,
                      AppColors.sky50,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Crop Breakdown & Method Breakdown
              if (analytics.cropBreakdown.isNotEmpty || analytics.methodBreakdown.isNotEmpty) ...[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (analytics.cropBreakdown.isNotEmpty)
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.gray200),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Water by Crop', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                              const SizedBox(height: 12),
                              ...analytics.cropBreakdown.map((cb) {
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(cb.crop, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                          Text('${cb.percentage}% (${NumberFormat('#,###').format(cb.liters)}L)',
                                              style: const TextStyle(fontSize: 11, color: AppColors.gray600)),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      LinearProgressIndicator(
                                        value: cb.percentage / 100,
                                        backgroundColor: AppColors.gray100,
                                        color: AppColors.emerald600,
                                        minHeight: 6,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ],
                                  ),
                                );
                              }),
                            ],
                          ),
                        ),
                      ),
                    if (analytics.cropBreakdown.isNotEmpty && analytics.methodBreakdown.isNotEmpty)
                      const SizedBox(width: 12),
                    if (analytics.methodBreakdown.isNotEmpty)
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.gray200),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Water by Method', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                              const SizedBox(height: 12),
                              ...analytics.methodBreakdown.map((mb) {
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(mb.method, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                          Text('${mb.percentage}% (${NumberFormat('#,###').format(mb.liters)}L)',
                                              style: const TextStyle(fontSize: 11, color: AppColors.gray600)),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      LinearProgressIndicator(
                                        value: mb.percentage / 100,
                                        backgroundColor: AppColors.gray100,
                                        color: AppColors.teal600,
                                        minHeight: 6,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ],
                                  ),
                                );
                              }),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
              ],

              // Filter Dropdown
              if (cropsList.length > 2) ...[
                Row(
                  children: [
                    const Text('Filter by crop: ', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                    const SizedBox(width: 8),
                    DropdownButton<String>(
                      value: _selectedCropFilter,
                      items: cropsList.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedCropFilter = val);
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 10),
              ],

              // Records List or Empty State
              if (filteredRecords.isEmpty)
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.gray200),
                  ),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(Icons.water_drop_outlined, size: 48, color: Colors.grey.shade300),
                        const SizedBox(height: 14),
                        const Text(
                          'No water usage logged yet.',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Start recording your daily irrigation to track water stewardship and efficiency.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13, color: AppColors.gray600),
                        ),
                        const SizedBox(height: 18),
                        ElevatedButton.icon(
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (_) => WaterLoggerDialog(userId: widget.userId),
                            );
                          },
                          icon: const Icon(Icons.add, size: 18),
                          label: const Text('Log First Irrigation'),
                        ),
                      ],
                    ),
                  ),
                )
              else
                ...filteredRecords.map((r) => _buildRecordCard(context, r)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, String sub, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.gray600)),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(height: 2),
          Text(sub, style: const TextStyle(fontSize: 10, color: AppColors.gray500)),
        ],
      ),
    );
  }

  Widget _buildRecordCard(BuildContext context, WaterUsageRecord record) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.emerald50,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.opacity, color: AppColors.emerald700, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      record.crop,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.gray900),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.gray100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        record.irrigationMethod,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.gray700),
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '${NumberFormat('#,###').format(record.waterUsed)} ${record.unit}',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.emerald800),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 12, color: AppColors.gray400),
                    const SizedBox(width: 4),
                    Text(record.date, style: const TextStyle(fontSize: 12, color: AppColors.gray600)),
                    if (record.durationHours != null) ...[
                      const SizedBox(width: 12),
                      const Icon(Icons.timer_outlined, size: 12, color: AppColors.gray400),
                      const SizedBox(width: 4),
                      Text('${record.durationHours} hrs', style: const TextStyle(fontSize: 12, color: AppColors.gray600)),
                    ],
                    if (record.areaCovered != null) ...[
                      const SizedBox(width: 12),
                      const Icon(Icons.crop_free, size: 12, color: AppColors.gray400),
                      const SizedBox(width: 4),
                      Text('${record.areaCovered} acres', style: const TextStyle(fontSize: 12, color: AppColors.gray600)),
                    ],
                  ],
                ),
                if (record.notes != null && record.notes!.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text('Note: ${record.notes!}', style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: AppColors.gray600)),
                ],
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.gray400),
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (_) => AlertDialog(
                  title: const Text('Delete Water Record?'),
                  content: const Text('Are you sure you want to remove this irrigation entry?'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                    ElevatedButton(
                      onPressed: () => Navigator.pop(context, true),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              );
              if (confirm == true) {
                await FirebaseService().deleteWaterRecord(widget.userId, record.id);
              }
            },
          ),
        ],
      ),
    );
  }
}
