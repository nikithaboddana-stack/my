import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/types.dart';
import '../services/firebase_service.dart';
import '../theme/app_theme.dart';

class IrrigationPlannerScreen extends StatefulWidget {
  final List<IrrigationSchedule> schedules;
  final WeatherReport? weather;
  final String userId;
  final String defaultCrop;

  const IrrigationPlannerScreen({
    super.key,
    required this.schedules,
    required this.weather,
    required this.userId,
    this.defaultCrop = '',
  });

  @override
  State<IrrigationPlannerScreen> createState() => _IrrigationPlannerScreenState();
}

class _IrrigationPlannerScreenState extends State<IrrigationPlannerScreen> {
  String _filterStatus = 'all';

  void _showAddScheduleDialog() {
    final formKey = GlobalKey<FormState>();
    final cropCtrl = TextEditingController(text: widget.defaultCrop);
    final waterCtrl = TextEditingController();
    final durationCtrl = TextEditingController();
    final notesCtrl = TextEditingController();
    String scheduledDate = DateFormat('yyyy-MM-dd').format(DateTime.now().add(const Duration(days: 1)));
    String scheduledTime = '06:30 AM';
    String irrigationMethod = 'Drip Irrigation';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDlgState) => Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 500),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.amber50,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.calendar_today, color: AppColors.amber700, size: 22),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Schedule Irrigation', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                              Text('Plan watering based on forecast & crop stage', style: TextStyle(fontSize: 12, color: AppColors.gray600)),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 20, color: AppColors.gray400),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Crop
                    TextFormField(
                      controller: cropCtrl,
                      decoration: const InputDecoration(labelText: 'Crop *', hintText: 'e.g. Wheat, Tomato'),
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter crop' : null,
                    ),
                    const SizedBox(height: 14),

                    // Date & Time
                    Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: DateTime.tryParse(scheduledDate) ?? DateTime.now(),
                                firstDate: DateTime.now().subtract(const Duration(days: 7)),
                                lastDate: DateTime.now().add(const Duration(days: 60)),
                              );
                              if (picked != null) {
                                setDlgState(() => scheduledDate = DateFormat('yyyy-MM-dd').format(picked));
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                              decoration: BoxDecoration(
                                border: Border.all(color: AppColors.gray200),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Date', style: TextStyle(fontSize: 11, color: AppColors.gray500)),
                                  Text(scheduledDate, style: const TextStyle(fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: InkWell(
                            onTap: () async {
                              final t = await showTimePicker(
                                context: context,
                                initialTime: const TimeOfDay(hour: 6, minute: 30),
                              );
                              if (t != null) {
                                setDlgState(() => scheduledTime = t.format(context));
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                              decoration: BoxDecoration(
                                border: Border.all(color: AppColors.gray200),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Time', style: TextStyle(fontSize: 11, color: AppColors.gray500)),
                                  Text(scheduledTime, style: const TextStyle(fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Planned Water & Duration
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: waterCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Planned Water (L)', hintText: 'e.g. 4000'),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: TextFormField(
                            controller: durationCtrl,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            decoration: const InputDecoration(labelText: 'Duration (Hours)', hintText: 'e.g. 2.0'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Method
                    DropdownButtonFormField<String>(
                      value: irrigationMethod,
                      decoration: const InputDecoration(labelText: 'Irrigation Method'),
                      items: kIrrigationMethods.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                      onChanged: (v) {
                        if (v != null) setDlgState(() => irrigationMethod = v);
                      },
                    ),
                    const SizedBox(height: 14),

                    // Notes
                    TextFormField(
                      controller: notesCtrl,
                      decoration: const InputDecoration(labelText: 'Notes', hintText: 'e.g. Run early morning before heat spike.'),
                    ),
                    const SizedBox(height: 24),

                    // Submit
                    ElevatedButton(
                      onPressed: () async {
                        if (!formKey.currentState!.validate()) return;
                        // Weather alert detection
                        String? weatherAlert;
                        if (widget.weather != null) {
                          for (final d in widget.weather!.forecast) {
                            if (d.date == scheduledDate && (d.precipitationProbability >= 60 || d.precipitationSum >= 6.0)) {
                              weatherAlert = 'High rain forecast on this date (${d.precipitationProbability}%). Consider skipping.';
                              break;
                            }
                          }
                        }

                        final sched = IrrigationSchedule(
                          id: 'sched_${DateTime.now().millisecondsSinceEpoch}',
                          userId: widget.userId,
                          crop: cropCtrl.text.trim(),
                          scheduledDate: scheduledDate,
                          scheduledTime: scheduledTime,
                          plannedWater: double.tryParse(waterCtrl.text.trim()),
                          durationHours: double.tryParse(durationCtrl.text.trim()),
                          irrigationMethod: irrigationMethod,
                          notes: notesCtrl.text.trim().isNotEmpty ? notesCtrl.text.trim() : null,
                          status: 'pending',
                          weatherAlert: weatherAlert,
                          createdAt: DateTime.now().toIso8601String(),
                        );

                        await FirebaseService().addIrrigationSchedule(sched);
                        if (ctx.mounted) Navigator.pop(ctx);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.emerald700,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('Add to Schedule'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filterStatus == 'all'
        ? widget.schedules
        : widget.schedules.where((s) => s.status == _filterStatus).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  gradient: AppColors.heroGradient,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white),
                ),
                child: Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '📅 Irrigation Planner',
                            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.gray900),
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Align irrigation timing with weather forecasts to prevent over-watering and rain conflicts.',
                            style: TextStyle(fontSize: 13, color: AppColors.gray700),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: _showAddScheduleDialog,
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text('+ New Plan'),
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.emerald700),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Status Filter Tabs
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterChip('all', 'All Schedules (${widget.schedules.length})'),
                    const SizedBox(width: 8),
                    _buildFilterChip('pending', 'Pending (${widget.schedules.where((s) => s.status == 'pending').length})'),
                    const SizedBox(width: 8),
                    _buildFilterChip('completed', 'Completed (${widget.schedules.where((s) => s.status == 'completed').length})'),
                    const SizedBox(width: 8),
                    _buildFilterChip('skipped_weather', 'Skipped for Weather (${widget.schedules.where((s) => s.status == 'skipped_weather').length})'),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Schedules List
              if (filtered.isEmpty)
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
                        Icon(Icons.calendar_today_outlined, size: 48, color: Colors.grey.shade300),
                        const SizedBox(height: 14),
                        const Text(
                          'No schedules match this filter.',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Create a schedule to organize upcoming crop irrigation.',
                          style: TextStyle(fontSize: 13, color: AppColors.gray600),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _showAddScheduleDialog,
                          icon: const Icon(Icons.add, size: 18),
                          label: const Text('Add Irrigation Plan'),
                        ),
                      ],
                    ),
                  ),
                )
              else
                ...filtered.map((s) => _buildScheduleCard(context, s)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String status, String label) {
    final isSel = _filterStatus == status;
    return FilterChip(
      label: Text(label),
      selected: isSel,
      onSelected: (_) => setState(() => _filterStatus = status),
      backgroundColor: Colors.white,
      selectedColor: AppColors.emerald100,
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
        color: isSel ? AppColors.emerald900 : AppColors.gray700,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: isSel ? AppColors.emerald500 : AppColors.gray200),
      ),
    );
  }

  Widget _buildScheduleCard(BuildContext context, IrrigationSchedule s) {
    final isPending = s.status == 'pending';
    final isCompleted = s.status == 'completed';
    final isSkipped = s.status == 'skipped_weather';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: s.weatherAlert != null ? AppColors.amber500 : AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isCompleted
                      ? AppColors.emerald50
                      : isSkipped
                          ? AppColors.sky50
                          : AppColors.amber50,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  isCompleted
                      ? Icons.check_circle_outline
                      : isSkipped
                          ? Icons.cloud_outlined
                          : Icons.schedule,
                  color: isCompleted
                      ? AppColors.emerald700
                      : isSkipped
                          ? AppColors.sky700
                          : AppColors.amber700,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          s.crop,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: isCompleted
                                ? AppColors.emerald100
                                : isSkipped
                                    ? AppColors.sky50
                                    : AppColors.gray100,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            s.status.toUpperCase(),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: isCompleted
                                  ? AppColors.emerald900
                                  : isSkipped
                                      ? AppColors.sky700
                                      : AppColors.gray700,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${s.scheduledDate}${s.scheduledTime != null ? " at ${s.scheduledTime}" : ""} · ${s.irrigationMethod ?? "Drip"}',
                      style: const TextStyle(fontSize: 12, color: AppColors.gray600),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.gray400),
                onPressed: () async {
                  await FirebaseService().deleteIrrigationSchedule(widget.userId, s.id);
                },
              ),
            ],
          ),
          if (s.weatherAlert != null) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.amber50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.amber500.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning_amber_rounded, size: 16, color: AppColors.amber700),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      s.weatherAlert!,
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.amber700),
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (s.notes != null) ...[
            const SizedBox(height: 8),
            Text('Notes: ${s.notes!}', style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: AppColors.gray600)),
          ],
          if (isPending) ...[
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                OutlinedButton(
                  onPressed: () async {
                    await FirebaseService().updateScheduleStatus(
                      widget.userId,
                      s.id,
                      'skipped_weather',
                      weatherAlert: 'Skipped due to rainfall or moist soil.',
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    textStyle: const TextStyle(fontSize: 11),
                  ),
                  child: const Text('Skip (Weather)'),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () async {
                    await FirebaseService().updateScheduleStatus(widget.userId, s.id, 'completed');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.emerald700,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    textStyle: const TextStyle(fontSize: 11),
                  ),
                  child: const Text('Mark Complete'),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
