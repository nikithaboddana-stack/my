import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/types.dart';
import '../services/firebase_service.dart';
import '../theme/app_theme.dart';

class WaterLoggerDialog extends StatefulWidget {
  final String userId;
  final String? defaultCrop;
  final String? defaultMethod;

  const WaterLoggerDialog({
    super.key,
    required this.userId,
    this.defaultCrop,
    this.defaultMethod,
  });

  @override
  State<WaterLoggerDialog> createState() => _WaterLoggerDialogState();
}

class _WaterLoggerDialogState extends State<WaterLoggerDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _cropController;
  late TextEditingController _volumeController;
  late TextEditingController _durationController;
  late TextEditingController _areaController;
  late TextEditingController _notesController;

  late String _selectedDate;
  String _unit = 'Liters';
  String _irrigationMethod = 'Drip Irrigation';
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _cropController = TextEditingController(text: widget.defaultCrop ?? '');
    _volumeController = TextEditingController();
    _durationController = TextEditingController();
    _areaController = TextEditingController();
    _notesController = TextEditingController();
    _selectedDate = DateFormat('yyyy-MM-dd').format(DateTime.now());

    if (widget.defaultMethod != null && kIrrigationMethods.contains(widget.defaultMethod)) {
      _irrigationMethod = widget.defaultMethod!;
    }
  }

  @override
  void dispose() {
    _cropController.dispose();
    _volumeController.dispose();
    _durationController.dispose();
    _areaController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.tryParse(_selectedDate) ?? now,
      firstDate: DateTime(now.year - 2),
      lastDate: DateTime(now.year + 1),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _saving = true);

    double volume = double.tryParse(_volumeController.text.trim()) ?? 0.0;
    // Normalize volume to liters if entered in gallons or m³
    double volumeInLiters = volume;
    if (_unit == 'Gallons') {
      volumeInLiters = volume * 3.78541;
    } else if (_unit == 'Cubic Meters (m³)') {
      volumeInLiters = volume * 1000.0;
    }

    final newRecord = WaterUsageRecord(
      id: 'rec_${DateTime.now().millisecondsSinceEpoch}',
      userId: widget.userId,
      crop: _cropController.text.trim(),
      date: _selectedDate,
      waterUsed: volumeInLiters,
      unit: _unit,
      irrigationMethod: _irrigationMethod,
      durationHours: double.tryParse(_durationController.text.trim()),
      areaCovered: double.tryParse(_areaController.text.trim()),
      notes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
      createdAt: DateTime.now().toIso8601String(),
    );

    await FirebaseService().addWaterRecord(newRecord);

    if (mounted) {
      Navigator.of(context).pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 520),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.emerald50,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.water_drop, color: AppColors.emerald700, size: 22),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Log Water Usage',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.gray900,
                            ),
                          ),
                          Text(
                            'Record real irrigation volume for accurate farm tracking',
                            style: TextStyle(fontSize: 12, color: AppColors.gray600),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 20, color: AppColors.gray400),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Crop Name
                TextFormField(
                  controller: _cropController,
                  decoration: const InputDecoration(
                    labelText: 'Crop Cultivated *',
                    hintText: 'e.g. Tomato, Wheat, Paddy, Cotton',
                    prefixIcon: Icon(Icons.grass, color: AppColors.emerald700, size: 20),
                  ),
                  validator: (val) =>
                      (val == null || val.trim().isEmpty) ? 'Please enter a crop name' : null,
                ),
                const SizedBox(height: 14),

                // Date Picker Tile
                InkWell(
                  onTap: _pickDate,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.gray200),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today, color: AppColors.emerald700, size: 20),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Irrigation Date',
                                style: TextStyle(fontSize: 11, color: AppColors.gray500)),
                            Text(_selectedDate,
                                style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.gray900)),
                          ],
                        ),
                        const Spacer(),
                        const Text('Change',
                            style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.emerald700)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Water Volume & Unit
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 6,
                      child: TextFormField(
                        controller: _volumeController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(
                          labelText: 'Water Volume *',
                          hintText: 'e.g. 5000',
                          prefixIcon:
                              Icon(Icons.opacity, color: AppColors.teal700, size: 20),
                        ),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Enter volume';
                          }
                          if (double.tryParse(val.trim()) == null) {
                            return 'Valid number';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 4,
                      child: DropdownButtonFormField<String>(
                        value: _unit,
                        decoration: const InputDecoration(
                          labelText: 'Unit',
                          contentPadding:
                              EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                        ),
                        items: const [
                          DropdownMenuItem(value: 'Liters', child: Text('Liters')),
                          DropdownMenuItem(value: 'Gallons', child: Text('Gallons')),
                          DropdownMenuItem(
                              value: 'Cubic Meters (m³)', child: Text('m³')),
                        ],
                        onChanged: (val) {
                          if (val != null) setState(() => _unit = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Irrigation Method
                DropdownButtonFormField<String>(
                  value: _irrigationMethod,
                  decoration: const InputDecoration(
                    labelText: 'Irrigation Method',
                    prefixIcon: Icon(Icons.shower, color: AppColors.emerald700, size: 20),
                  ),
                  items: kIrrigationMethods.map((m) {
                    return DropdownMenuItem(value: m, child: Text(m));
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _irrigationMethod = val);
                  },
                ),
                const SizedBox(height: 14),

                // Duration & Area
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _durationController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(
                          labelText: 'Duration (Hours)',
                          hintText: 'e.g. 2.5',
                          prefixIcon:
                              Icon(Icons.timer_outlined, color: AppColors.gray500, size: 18),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextFormField(
                        controller: _areaController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(
                          labelText: 'Area Covered',
                          hintText: 'e.g. 1.5',
                          prefixIcon:
                              Icon(Icons.aspect_ratio, color: AppColors.gray500, size: 18),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Notes
                TextFormField(
                  controller: _notesController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Notes (Optional)',
                    hintText: 'e.g. Lateral lines flushed before run; morning cycle.',
                  ),
                ),
                const SizedBox(height: 24),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text('Cancel'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _saving ? null : _save,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.emerald700,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        child: _saving
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text('Save Record'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
