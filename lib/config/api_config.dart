import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConfig {
  static const String openMeteoBaseUrl = 'https://api.open-meteo.com/v1';
  static const String openMeteoGeocodingUrl = 'https://geocoding-api.open-meteo.com/v1';

  // AgriFlow Gemini AI Backend URL
  // On web, relative path '/api' reaches the same Express server.
  // On mobile/emulator, fallback to localhost:3000 or the production Cloud Run URL if configured.
  static String backendBaseUrl = kIsWeb ? '' : 'http://10.0.2.2:3000';

  static const int timeoutSeconds = 12;
  static const int maxRetries = 2;
}
