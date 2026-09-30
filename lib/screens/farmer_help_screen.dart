import 'package:flutter/material.dart';
import '../models/types.dart';
import '../services/firebase_service.dart';
import '../theme/app_theme.dart';

class FarmerHelpScreen extends StatefulWidget {
  final List<FarmerQuestion> questions;
  final String userId;
  final VoidCallback onNavigateToKnowledge;
  final VoidCallback onNavigateToCrops;

  const FarmerHelpScreen({
    super.key,
    required this.questions,
    required this.userId,
    required this.onNavigateToKnowledge,
    required this.onNavigateToCrops,
  });

  @override
  State<FarmerHelpScreen> createState() => _FarmerHelpScreenState();
}

class _FarmerHelpScreenState extends State<FarmerHelpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _questionCtrl = TextEditingController();
  final _cropCtrl = TextEditingController();
  String _category = 'Irrigation & Water';
  bool _submitting = false;

  final List<String> _categories = [
    'Irrigation & Water',
    'Leaf / Crop Health',
    'Soil & Moisture',
    'Pest & Growth',
    'General',
  ];

  @override
  void dispose() {
    _questionCtrl.dispose();
    _cropCtrl.dispose();
    super.dispose();
  }

  Future<void> _submitQuestion() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);

    final q = FarmerQuestion(
      id: 'q_${DateTime.now().millisecondsSinceEpoch}',
      userId: widget.userId,
      question: _questionCtrl.text.trim(),
      crop: _cropCtrl.text.trim().isNotEmpty ? _cropCtrl.text.trim() : 'General',
      category: _category,
      status: 'Open',
      createdAt: DateTime.now().toIso8601String(),
    );

    await FirebaseService().addFarmerQuestion(q);

    _questionCtrl.clear();
    _cropCtrl.clear();
    setState(() => _submitting = false);
  }

  @override
  Widget build(BuildContext context) {
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
                      '❓ Farmer Help & Extension Questions',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.gray900),
                    ),
                    SizedBox(height: 6),
                    Text(
                      'Log farming doubts, water challenges, and crop observations for record keeping and agronomic review.',
                      style: TextStyle(fontSize: 13, color: AppColors.gray700),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Safety Reminder Banner
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.amber50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.amber500.withValues(alpha: 0.3)),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.shield_outlined, color: AppColors.amber700, size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Agronomic Safety Note: Disease and pest symptoms (e.g. leaf yellowing) can originate from multiple distinct causes. Physical leaf inspection with a local university extension officer is strongly recommended before applying chemical sprays.',
                        style: TextStyle(fontSize: 12, color: AppColors.gray800, height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Question Form
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.gray200),
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Post a New Agricultural Doubt',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
                      ),
                      const SizedBox(height: 14),
                      TextFormField(
                        controller: _questionCtrl,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          labelText: 'Your Question / Observation *',
                          hintText: 'e.g. What is the best drip interval for tomato during hot dry weather?',
                        ),
                        validator: (v) => (v == null || v.trim().isEmpty) ? 'Please describe your doubt' : null,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _cropCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Related Crop',
                                hintText: 'e.g. Wheat, Tomato, Paddy',
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: _category,
                              decoration: const InputDecoration(labelText: 'Topic'),
                              items: _categories
                                  .map((c) => DropdownMenuItem(value: c, child: Text(c, overflow: TextOverflow.ellipsis)))
                                  .toList(),
                              onChanged: (v) {
                                if (v != null) setState(() => _category = v);
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Align(
                        alignment: Alignment.centerRight,
                        child: ElevatedButton.icon(
                          onPressed: _submitting ? null : _submitQuestion,
                          icon: const Icon(Icons.send, size: 16),
                          label: _submitting
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                )
                              : const Text('Submit Doubt'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.emerald700,
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Existing Questions List
              const Text(
                'My Submitted Questions & Guidance',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
              ),
              const SizedBox(height: 10),
              if (widget.questions.isEmpty)
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.gray200),
                  ),
                  child: const Center(
                    child: Column(
                      children: [
                        Icon(Icons.help_outline, size: 48, color: Colors.grey),
                        SizedBox(height: 12),
                        Text(
                          'No doubts recorded yet.',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.gray800),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Submit any water management or crop doubt above to keep a record.',
                          style: TextStyle(fontSize: 12, color: AppColors.gray600),
                        ),
                      ],
                    ),
                  ),
                )
              else
                ...widget.questions.map((q) => _buildQuestionCard(q)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuestionCard(FarmerQuestion q) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.emerald50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  q.category,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.emerald800),
                ),
              ),
              const SizedBox(width: 8),
              if (q.crop.isNotEmpty)
                Text(
                  'Crop: ${q.crop}',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.gray700),
                ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: q.status == 'Reviewed' ? AppColors.emerald100 : AppColors.amber50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  q.status,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: q.status == 'Reviewed' ? AppColors.emerald900 : AppColors.amber700,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, size: 16, color: AppColors.gray400),
                onPressed: () async {
                  await FirebaseService().deleteFarmerQuestion(widget.userId, q.id);
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            q.question,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.gray900),
          ),
          if (q.adviceNotes != null && q.adviceNotes!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.emerald50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'Agronomy Review: ${q.adviceNotes}',
                style: const TextStyle(fontSize: 12, color: AppColors.emerald900),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
