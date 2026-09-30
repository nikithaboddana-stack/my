import 'package:flutter/material.dart';
import '../models/types.dart';
import '../services/weather_service.dart';
import '../theme/app_theme.dart';

class WeatherScreen extends StatefulWidget {
  final WeatherReport? weather;
  final bool loading;
  final VoidCallback onRefresh;
  final Function(double lat, double lon, String city) onLocationChange;

  const WeatherScreen({
    super.key,
    required this.weather,
    required this.loading,
    required this.onRefresh,
    required this.onLocationChange,
  });

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<GeocodingResult> _searchResults = [];
  bool _searching = false;

  Future<void> _doSearch(String query) async {
    if (query.trim().length < 2) {
      setState(() => _searchResults = []);
      return;
    }
    setState(() => _searching = true);
    final res = await WeatherService.searchLocations(query);
    if (mounted) {
      setState(() {
        _searchResults = res;
        _searching = false;
      });
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
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
                child: Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '🌦️ Live Agricultural Weather',
                            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.gray900),
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Real-time meteorological forecast & agricultural advisories powered by Open-Meteo REST API.',
                            style: TextStyle(fontSize: 13, color: AppColors.gray700),
                          ),
                        ],
                      ),
                    ),
                    if (widget.weather != null)
                      IconButton(
                        icon: const Icon(Icons.refresh, color: AppColors.sky700),
                        onPressed: widget.onRefresh,
                        tooltip: 'Refresh Weather',
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Search Bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.gray200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextFormField(
                      controller: _searchCtrl,
                      decoration: InputDecoration(
                        labelText: 'Search Farm City / Location',
                        hintText: 'e.g. Pune, Ludhiana, Fresno, Nairobi...',
                        prefixIcon: const Icon(Icons.search, color: AppColors.sky700),
                        suffixIcon: _searching
                            ? const Padding(
                                padding: EdgeInsets.all(12),
                                child: SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                              )
                            : IconButton(
                                icon: const Icon(Icons.arrow_forward),
                                onPressed: () => _doSearch(_searchCtrl.text),
                              ),
                      ),
                      onChanged: (v) => _doSearch(v),
                    ),
                    if (_searchResults.isNotEmpty) ...[
                      const SizedBox(height: 10),
                      Container(
                        constraints: const BoxConstraints(maxHeight: 200),
                        decoration: BoxDecoration(
                          color: AppColors.gray50,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.gray200),
                        ),
                        child: ListView.separated(
                          shrinkWrap: true,
                          itemCount: _searchResults.length,
                          separatorBuilder: (_, __) => const Divider(height: 1),
                          itemBuilder: (ctx, idx) {
                            final item = _searchResults[idx];
                            return ListTile(
                              leading: const Icon(Icons.place, color: AppColors.sky700),
                              title: Text(item.displayName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                              subtitle: Text('${item.latitude.toStringAsFixed(2)}°, ${item.longitude.toStringAsFixed(2)}°', style: const TextStyle(fontSize: 11)),
                              onTap: () {
                                widget.onLocationChange(item.latitude, item.longitude, item.displayName);
                                setState(() {
                                  _searchResults = [];
                                  _searchCtrl.text = item.displayName;
                                });
                              },
                            );
                          },
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Weather Display
              if (widget.loading)
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
                        CircularProgressIndicator(strokeWidth: 2),
                        SizedBox(height: 12),
                        Text('Fetching live meteorological telemetry...', style: TextStyle(color: AppColors.gray600)),
                      ],
                    ),
                  ),
                )
              else if (widget.weather == null)
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
                        Icon(Icons.location_off_outlined, size: 54, color: Colors.grey.shade300),
                        const SizedBox(height: 14),
                        const Text(
                          'No Location Configured',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.gray900),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Search for your farm location or city above to pull live weather and agricultural irrigation advisories.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13, color: AppColors.gray600),
                        ),
                      ],
                    ),
                  ),
                )
              else ...[
                _buildLiveCard(widget.weather!),
                const SizedBox(height: 16),
                _buildForecastSection(widget.weather!),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLiveCard(WeatherReport report) {
    final cur = report.current;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.sky500.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(color: AppColors.sky500.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.pin_drop, size: 16, color: AppColors.sky700),
                      const SizedBox(width: 4),
                      Text(report.city, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.gray900)),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text('Updated ${report.fetchedAt} · Source: ${report.source}', style: const TextStyle(fontSize: 11, color: AppColors.gray500)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.emerald50, borderRadius: BorderRadius.circular(12)),
                child: const Text('LIVE SATELLITE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.emerald800)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Text(
                '${cur.temperature}°C',
                style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: AppColors.gray900),
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(cur.weatherDescription, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.gray800)),
                  Text(cur.isRaining ? '🌧️ Currently raining' : '☀️ Dry conditions', style: const TextStyle(fontSize: 12, color: AppColors.gray600)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: _buildMetricTile(Icons.water_drop, 'Humidity', '${cur.humidity}%')),
              Expanded(child: _buildMetricTile(Icons.air, 'Wind Speed', '${cur.windSpeed} km/h')),
              Expanded(child: _buildMetricTile(Icons.umbrella, 'Rain Prob', '${cur.rainProbability}%')),
              Expanded(child: _buildMetricTile(Icons.cloud_queue, 'Precipitation', '${cur.precipitation} mm')),
            ],
          ),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.emerald50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.emerald100),
            ),
            child: Row(
              children: [
                const Icon(Icons.eco, color: AppColors.emerald700, size: 22),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    report.agriAdvice,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.emerald900),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile(IconData icon, String label, String val) {
    return Column(
      children: [
        Icon(icon, size: 18, color: AppColors.sky700),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.gray500)),
        Text(val, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.gray900)),
      ],
    );
  }

  Widget _buildForecastSection(WeatherReport report) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '7-Day Agricultural Forecast',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.gray900),
        ),
        const SizedBox(height: 10),
        ...report.forecast.map((day) {
          final codeInfo = WeatherService.interpretWeatherCode(day.weatherCode);
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
                Text(codeInfo.icon, style: const TextStyle(fontSize: 22)),
                const SizedBox(width: 12),
                Expanded(
                  flex: 3,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(day.date, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.gray900)),
                      Text(codeInfo.description, style: const TextStyle(fontSize: 11, color: AppColors.gray600)),
                    ],
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Row(
                    children: [
                      const Icon(Icons.arrow_upward, size: 12, color: Colors.red),
                      Text('${day.tempMax}°', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 4),
                      const Icon(Icons.arrow_downward, size: 12, color: Colors.blue),
                      Text('${day.tempMin}°', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                Expanded(
                  flex: 3,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('💧 ${day.precipitationProbability}% (${day.precipitationSum}mm)',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.sky700)),
                      if (day.advisory != null)
                        Text(day.advisory!,
                            style: const TextStyle(fontSize: 10, color: AppColors.gray600),
                            overflow: TextOverflow.ellipsis),
                    ],
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}
