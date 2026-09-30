import 'package:flutter/material.dart';
import '../models/types.dart';
import '../services/firebase_service.dart';
import '../services/weather_service.dart';
import '../theme/app_theme.dart';

class FarmSetupDialog extends StatefulWidget {
  final String userId;
  final FarmDetails? existingFarm;

  const FarmSetupDialog({
    super.key,
    required this.userId,
    this.existingFarm,
  });

  @override
  State<FarmSetupDialog> createState() => _FarmSetupDialogState();
}

class _FarmSetupDialogState extends State<FarmSetupDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _areaController;
  late TextEditingController _cropsController;
  late TextEditingController _citySearchController;

  String _areaUnit = 'acres';
  String _soilType = 'Loam';
  String _irrigationMethod = 'Drip Irrigation';
  String _waterSource = 'Borewell / Groundwater';

  double? _selectedLat;
  double? _selectedLon;
  String? _selectedCityName;

  bool _isSearchingCity = false;
  List<GeocodingResult> _cityResults = [];
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final f = widget.existingFarm;
    _nameController = TextEditingController(text: f?.farmName ?? 'Green Valley Farm');
    _areaController = TextEditingController(text: f?.farmArea != null ? f!.farmArea.toString() : '5.0');
    _cropsController = TextEditingController(text: f?.crops ?? 'Wheat, Tomato');
    _citySearchController = TextEditingController(text: f?.cityName ?? '');

    if (f?.areaUnit != null) _areaUnit = f!.areaUnit;
    if (f?.soilType != null && kSoilTypes.contains(f!.soilType)) _soilType = f.soilType!;
    if (f?.irrigationMethod != null && kIrrigationMethods.contains(f!.irrigationMethod)) {
      _irrigationMethod = f.irrigationMethod!;
    }
    if (f?.waterSource != null && kWaterSources.contains(f!.waterSource)) {
      _waterSource = f.waterSource!;
    }

    _selectedLat = f?.latitude;
    _selectedLon = f?.longitude;
    _selectedCityName = f?.cityName;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _areaController.dispose();
    _cropsController.dispose();
    _citySearchController.dispose();
    super.dispose();
  }

  Future<void> _searchCity(String query) async {
    if (query.trim().length < 2) {
      setState(() => _cityResults = []);
      return;
    }
    setState(() => _isSearchingCity = true);
    final results = await WeatherService.searchLocations(query);
    if (mounted) {
      setState(() {
        _cityResults = results;
        _isSearchingCity = false;
      });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final updated = FarmDetails(
      userId: widget.userId,
      farmName: _nameController.text.trim(),
      farmArea: double.tryParse(_areaController.text.trim()),
      areaUnit: _areaUnit,
      soilType: _soilType,
      crops: _cropsController.text.trim(),
      irrigationMethod: _irrigationMethod,
      waterSource: _waterSource,
      latitude: _selectedLat,
      longitude: _selectedLon,
      cityName: _selectedCityName ?? _citySearchController.text.trim(),
      updatedAt: DateTime.now().toIso8601String(),
    );

    await FirebaseService().saveFarmDetails(updated);

    if (mounted) {
      Navigator.of(context).pop(updated);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 540),
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
                      child: const Icon(Icons.agriculture, color: AppColors.emerald700, size: 22),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Farm Profile & Settings',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.gray900,
                            ),
                          ),
                          Text(
                            'Personalize irrigation advice and live weather for your location',
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

                // Farm Name
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Farm Name *',
                    hintText: 'e.g. Sunrise Organic Farm',
                    prefixIcon: Icon(Icons.home_work_outlined, color: AppColors.emerald700, size: 20),
                  ),
                  validator: (val) =>
                      (val == null || val.trim().isEmpty) ? 'Please enter farm name' : null,
                ),
                const SizedBox(height: 14),

                // Area and Unit
                Row(
                  children: [
                    Expanded(
                      flex: 6,
                      child: TextFormField(
                        controller: _areaController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(
                          labelText: 'Total Farm Area',
                          hintText: 'e.g. 10',
                          prefixIcon: Icon(Icons.crop_free, color: AppColors.teal700, size: 20),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 4,
                      child: DropdownButtonFormField<String>(
                        value: _areaUnit,
                        decoration: const InputDecoration(
                          labelText: 'Unit',
                          contentPadding:
                              EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                        ),
                        items: const [
                          DropdownMenuItem(value: 'acres', child: Text('Acres')),
                          DropdownMenuItem(value: 'hectares', child: Text('Hectares')),
                          DropdownMenuItem(value: 'm²', child: Text('m²')),
                        ],
                        onChanged: (val) {
                          if (val != null) setState(() => _areaUnit = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Soil Type & Primary Irrigation
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _soilType,
                        decoration: const InputDecoration(
                          labelText: 'Soil Type',
                          prefixIcon: Icon(Icons.terrain, color: AppColors.amber700, size: 20),
                        ),
                        items: kSoilTypes.map((s) {
                          return DropdownMenuItem(value: s, child: Text(s));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _soilType = val);
                        },
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _irrigationMethod,
                        decoration: const InputDecoration(
                          labelText: 'Primary Method',
                          prefixIcon: Icon(Icons.shower, color: AppColors.teal700, size: 20),
                        ),
                        items: kIrrigationMethods.map((m) {
                          return DropdownMenuItem(value: m, child: Text(m, overflow: TextOverflow.ellipsis));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _irrigationMethod = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Water Source
                DropdownButtonFormField<String>(
                  value: _waterSource,
                  decoration: const InputDecoration(
                    labelText: 'Water Source',
                    prefixIcon: Icon(Icons.waves, color: AppColors.sky700, size: 20),
                  ),
                  items: kWaterSources.map((w) {
                    return DropdownMenuItem(value: w, child: Text(w));
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _waterSource = val);
                  },
                ),
                const SizedBox(height: 14),

                // Crops
                TextFormField(
                  controller: _cropsController,
                  decoration: const InputDecoration(
                    labelText: 'Crops Grown',
                    hintText: 'e.g. Wheat, Tomato, Cotton',
                    prefixIcon: Icon(Icons.eco_outlined, color: AppColors.emerald700, size: 20),
                  ),
                ),
                const SizedBox(height: 14),

                // City / Location Search
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextFormField(
                      controller: _citySearchController,
                      decoration: InputDecoration(
                        labelText: 'Farm City / Region (Live Weather)',
                        hintText: 'Type city name to search...',
                        prefixIcon: const Icon(Icons.location_on_outlined, color: AppColors.sky700, size: 20),
                        suffixIcon: _isSearchingCity
                            ? const Padding(
                                padding: EdgeInsets.all(12),
                                child: SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                ),
                              )
                            : IconButton(
                                icon: const Icon(Icons.search, size: 20),
                                onPressed: () => _searchCity(_citySearchController.text),
                              ),
                      ),
                      onChanged: (val) => _searchCity(val),
                    ),
                    if (_selectedLat != null && _selectedLon != null) ...[
                      const SizedBox(height: 6),
                      Padding(
                        padding: const EdgeInsets.only(left: 4),
                        child: Text(
                          '📍 Coordinates: ${_selectedLat!.toStringAsFixed(2)}°, ${_selectedLon!.toStringAsFixed(2)}° (${_selectedCityName ?? "Selected"})',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.emerald700,
                          ),
                        ),
                      ),
                    ],
                    if (_cityResults.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Container(
                        constraints: const BoxConstraints(maxHeight: 180),
                        decoration: BoxDecoration(
                          color: AppColors.gray50,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.gray200),
                        ),
                        child: ListView.separated(
                          shrinkWrap: true,
                          itemCount: _cityResults.length,
                          separatorBuilder: (_, __) => const Divider(height: 1),
                          itemBuilder: (context, idx) {
                            final c = _cityResults[idx];
                            return ListTile(
                              dense: true,
                              visualDensity: VisualDensity.compact,
                              leading: const Icon(Icons.place, size: 16, color: AppColors.sky700),
                              title: Text(c.displayName, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                              subtitle: Text('${c.latitude.toStringAsFixed(2)}°, ${c.longitude.toStringAsFixed(2)}°', style: const TextStyle(fontSize: 11)),
                              onTap: () {
                                setState(() {
                                  _selectedLat = c.latitude;
                                  _selectedLon = c.longitude;
                                  _selectedCityName = c.displayName;
                                  _citySearchController.text = c.displayName;
                                  _cityResults = [];
                                });
                              },
                            );
                          },
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 24),

                // Save buttons
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
                            : const Text('Save Farm Profile'),
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
