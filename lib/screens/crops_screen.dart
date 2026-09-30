import 'package:flutter/material.dart';
import '../data/crop_knowledge.dart';
import '../models/types.dart';
import '../theme/app_theme.dart';
import '../widgets/water_logger_dialog.dart';

class CropsScreen extends StatefulWidget {
  final Function(String cropName) onPlanForCrop;
  final String userId;

  const CropsScreen({
    super.key,
    required this.onPlanForCrop,
    required this.userId,
  });

  @override
  State<CropsScreen> createState() => _CropsScreenState();
}

class _CropsScreenState extends State<CropsScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Grain',
    'Vegetable',
    'Commercial',
    'Fruit',
  ];

  Color _getWaterNeedColor(String need) {
    switch (need) {
      case 'Critical':
        return Colors.red.shade700;
      case 'High':
        return Colors.orange.shade800;
      case 'Moderate':
        return AppColors.teal700;
      case 'Low':
      default:
        return AppColors.emerald700;
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredCrops = _selectedCategory == 'All'
        ? kCropKnowledgeList
        : kCropKnowledgeList.where((c) => c.category == _selectedCategory).toList();

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
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '🌾 Crop Water & Agronomy Knowledge',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.gray900),
                    ),
                    SizedBox(height: 6),
                    Text(
                      'Discover crop-specific water requirements, critical growth stages, and optimal irrigation practices.',
                      style: TextStyle(fontSize: 13, color: AppColors.gray700),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _categories.map((cat) {
                    final isSel = _selectedCategory == cat;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(cat),
                        selected: isSel,
                        onSelected: (_) => setState(() => _selectedCategory = cat),
                        backgroundColor: Colors.white,
                        selectedColor: AppColors.emerald100,
                        labelStyle: TextStyle(
                          fontSize: 12,
                          fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                          color: isSel ? AppColors.emerald900 : AppColors.gray700,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: isSel ? AppColors.emerald500 : AppColors.gray200,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 16),

              // Crop Cards
              ...filteredCrops.map((crop) => _buildCropCard(context, crop)),

              const SizedBox(height: 24),

              // Benchmark Table Card
              _buildBenchmarksTable(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCropCard(BuildContext context, CropDetail crop) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.gray200),
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
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.emerald50,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(crop.icon, style: const TextStyle(fontSize: 26)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          crop.name,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.gray900),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.gray100,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            crop.category,
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.gray700),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(crop.overview, style: const TextStyle(fontSize: 12, color: AppColors.gray600)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Water Considerations
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.teal50.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.teal500.withValues(alpha: 0.2)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.water_drop_outlined, size: 18, color: AppColors.teal700),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Water Considerations', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.teal700)),
                      const SizedBox(height: 2),
                      Text(crop.waterConsiderations, style: const TextStyle(fontSize: 12, color: AppColors.gray700)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Growth Stages
          const Text('Critical Growth Stages & Water Needs', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.gray900)),
          const SizedBox(height: 8),
          ...crop.growthStages.map((stage) {
            final color = _getWaterNeedColor(stage.waterNeed);
            return Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.gray50,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.gray200),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        stage.waterNeed,
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: color),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(stage.stage, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.gray900)),
                          const SizedBox(height: 1),
                          Text(stage.description, style: const TextStyle(fontSize: 11, color: AppColors.gray600)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 14),

          // Suitable Methods
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: crop.suitableMethods.map((m) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.emerald50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.emerald100),
                ),
                child: Text('🚿 $m', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.emerald800)),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Action Buttons: Plan Irrigation & Log Water
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              OutlinedButton.icon(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => WaterLoggerDialog(
                      userId: widget.userId,
                      defaultCrop: crop.name,
                      defaultMethod: crop.suitableMethods.isNotEmpty ? crop.suitableMethods.first : null,
                    ),
                  );
                },
                icon: const Icon(Icons.water_drop, size: 16),
                label: const Text('Log Water'),
                style: OutlinedButton.styleFrom(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton.icon(
                onPressed: () => widget.onPlanForCrop(crop.name),
                icon: const Icon(Icons.calendar_today, size: 16),
                label: const Text('Plan Irrigation'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.emerald700,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBenchmarksTable() {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'General Crop Water Benchmarks (m³ per Hectare)',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
          ),
          const SizedBox(height: 4),
          const Text(
            'FAO standardized ranges for typical agricultural conditions across growth cycles.',
            style: TextStyle(fontSize: 12, color: AppColors.gray600),
          ),
          const SizedBox(height: 14),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columnSpacing: 24,
              columns: const [
                DataColumn(label: Text('Crop', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('Water Need (m³/ha)', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('Recommended Method', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('Critical Stage', style: TextStyle(fontWeight: FontWeight.bold))),
              ],
              rows: kCropWaterBenchmarks.map((b) {
                return DataRow(cells: [
                  DataCell(Text(b.crop, style: const TextStyle(fontWeight: FontWeight.w600))),
                  DataCell(Text(b.waterPerHaM3)),
                  DataCell(Text(b.recommendedMethod)),
                  DataCell(Text(b.criticalStage)),
                ]);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
