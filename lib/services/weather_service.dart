import 'package:intl/intl.dart';
import '../config/api_config.dart';
import '../models/types.dart';
import 'api_service.dart';

class GeocodingResult {
  final int id;
  final String name;
  final double latitude;
  final double longitude;
  final String? country;
  final String? admin1;

  GeocodingResult({
    required this.id,
    required this.name,
    required this.latitude,
    required this.longitude,
    this.country,
    this.admin1,
  });

  String get displayName {
    final parts = [name];
    if (admin1 != null && admin1!.isNotEmpty) parts.add(admin1!);
    if (country != null && country!.isNotEmpty) parts.add(country!);
    return parts.join(', ');
  }

  factory GeocodingResult.fromJson(Map<String, dynamic> json) {
    return GeocodingResult(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: (json['name'] ?? '').toString(),
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      country: json['country']?.toString(),
      admin1: json['admin1']?.toString(),
    );
  }
}

class WeatherService {
  static final ApiService _api = ApiService();

  static ({String description, String icon, bool isRaining}) interpretWeatherCode(int code) {
    switch (code) {
      case 0:
        return (description: 'Clear sky', icon: '☀️', isRaining: false);
      case 1:
        return (description: 'Mainly clear', icon: '🌤️', isRaining: false);
      case 2:
        return (description: 'Partly cloudy', icon: '⛅', isRaining: false);
      case 3:
        return (description: 'Overcast', icon: '☁️', isRaining: false);
      case 45:
      case 48:
        return (description: 'Foggy / Haze', icon: '🌫️', isRaining: false);
      case 51:
      case 53:
      case 55:
        return (description: 'Drizzle', icon: '🌦️', isRaining: true);
      case 61:
      case 63:
      case 65:
        return (description: 'Rain', icon: '🌧️', isRaining: true);
      case 71:
      case 73:
      case 75:
        return (description: 'Snow fall', icon: '🌨️', isRaining: false);
      case 80:
      case 81:
      case 82:
        return (description: 'Rain showers', icon: '🌦️', isRaining: true);
      case 95:
      case 96:
      case 99:
        return (description: 'Thunderstorm', icon: '⛈️', isRaining: true);
      default:
        return (description: 'Cloudy', icon: '⛅', isRaining: false);
    }
  }

  static String generateAgriculturalAdvice(
    int temp,
    int humidity,
    int rainProb,
    double precipitationSum,
    int windSpeed,
  ) {
    if (rainProb >= 65 || precipitationSum > 6) {
      return '🌧️ Rain expected. Consider delaying scheduled irrigation to conserve water and prevent waterlogging.';
    }
    if (temp > 35 && humidity < 35) {
      return '🔥 High temperature & dry air. Evaporation rate is elevated. Irrigate during early morning or evening hours.';
    }
    if (windSpeed > 20) {
      return '💨 Elevated wind speeds (>20 km/h). Overhead sprinkler irrigation may drift unevenly.';
    }
    return '🌱 Favorable conditions for standard crop irrigation based on root-zone moisture.';
  }

  static Future<List<GeocodingResult>> searchLocations(String query) async {
    if (query.trim().length < 2) return [];
    try {
      final res = await _api.get(
        '${ApiConfig.openMeteoGeocodingUrl}/search',
        queryParams: {
          'name': query.trim(),
          'count': 5,
          'language': 'en',
          'format': 'json',
        },
      );

      if (res is Map && res['results'] is List) {
        return (res['results'] as List)
            .map((item) => GeocodingResult.fromJson(Map<String, dynamic>.from(item)))
            .toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  static Future<WeatherReport?> fetchLiveWeather(
    double? latitude,
    double? longitude,
    String? cityName,
  ) async {
    if (latitude == null || longitude == null) {
      return null;
    }

    try {
      final res = await _api.get(
        '${ApiConfig.openMeteoBaseUrl}/forecast',
        queryParams: {
          'latitude': latitude,
          'longitude': longitude,
          'current': 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
          'daily': 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
          'timezone': 'auto',
          'forecast_days': 7,
        },
      );

      if (res is! Map) return null;

      final currentRaw = res['current'] as Map<dynamic, dynamic>? ?? {};
      final dailyRaw = res['daily'] as Map<dynamic, dynamic>? ?? {};

      final weatherCode = (currentRaw['weather_code'] as num?)?.toInt() ?? 0;
      final codeInfo = interpretWeatherCode(weatherCode);

      final precipitationRaw = (currentRaw['precipitation'] as num?)?.toDouble() ?? 0.0;
      final dailyProbs = (dailyRaw['precipitation_probability_max'] as List?)?.cast<num>();
      final dailySums = (dailyRaw['precipitation_sum'] as List?)?.cast<num>();

      final rainProb = dailyProbs != null && dailyProbs.isNotEmpty
          ? dailyProbs[0].toInt()
          : (precipitationRaw > 0 ? 90 : 10);
      final precipitationSum = dailySums != null && dailySums.isNotEmpty
          ? dailySums[0].toDouble()
          : precipitationRaw;

      final current = CurrentWeather(
        temperature: ((currentRaw['temperature_2m'] as num?)?.toDouble() ?? 0.0).round(),
        humidity: ((currentRaw['relative_humidity_2m'] as num?)?.toDouble() ?? 0.0).round(),
        windSpeed: ((currentRaw['wind_speed_10m'] as num?)?.toDouble() ?? 0.0).round(),
        weatherCode: weatherCode,
        weatherDescription: codeInfo.description,
        rainProbability: rainProb,
        isRaining: codeInfo.isRaining || precipitationRaw > 0,
        precipitation: double.parse(precipitationRaw.toStringAsFixed(1)),
        timestamp: (currentRaw['time'] ?? DateTime.now().toIso8601String()).toString(),
      );

      final List<DailyForecastItem> forecast = [];
      final times = (dailyRaw['time'] as List?)?.cast<dynamic>();
      final maxTemps = (dailyRaw['temperature_2m_max'] as List?)?.cast<num>();
      final minTemps = (dailyRaw['temperature_2m_min'] as List?)?.cast<num>();
      final codes = (dailyRaw['weather_code'] as List?)?.cast<num>();

      if (times != null) {
        for (int i = 0; i < times.length; i++) {
          final pProb = (dailyProbs != null && i < dailyProbs.length) ? dailyProbs[i].toInt() : 0;
          final pSum = (dailySums != null && i < dailySums.length) ? dailySums[i].toDouble() : 0.0;
          final wCode = (codes != null && i < codes.length) ? codes[i].toInt() : 0;

          String? advisory;
          if (pProb >= 65 || pSum >= 6.0) {
            advisory = 'High rain expected — delay irrigation';
          } else if (pProb >= 35) {
            advisory = 'Possible showers — check soil first';
          } else {
            advisory = 'Dry day — normal irrigation';
          }

          forecast.add(DailyForecastItem(
            date: times[i].toString(),
            tempMax: maxTemps != null && i < maxTemps.length ? maxTemps[i].round() : 0,
            tempMin: minTemps != null && i < minTemps.length ? minTemps[i].round() : 0,
            precipitationProbability: pProb,
            precipitationSum: double.parse(pSum.toStringAsFixed(1)),
            weatherCode: wCode,
            advisory: advisory,
          ));
        }
      }

      final agriAdvice = generateAgriculturalAdvice(
        current.temperature,
        current.humidity,
        current.rainProbability,
        precipitationSum,
        current.windSpeed,
      );

      final displayCity = (cityName != null && cityName.isNotEmpty)
          ? cityName
          : '${latitude.toStringAsFixed(2)}°, ${longitude.toStringAsFixed(2)}°';

      return WeatherReport(
        city: displayCity,
        latitude: latitude,
        longitude: longitude,
        current: current,
        forecast: forecast,
        agriAdvice: agriAdvice,
        isLive: true,
        fetchedAt: DateFormat('hh:mm a').format(DateTime.now()),
        source: 'Live Open-Meteo REST API',
      );
    } catch (_) {
      return null;
    }
  }
}
