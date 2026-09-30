import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiLogEntry {
  final String id;
  final String method;
  final String url;
  final int status;
  final String statusText;
  final int latencyMs;
  final String timestamp;
  final bool success;
  final String? errorMessage;
  final dynamic requestBody;
  final dynamic responseBody;

  ApiLogEntry({
    required this.id,
    required this.method,
    required this.url,
    required this.status,
    required this.statusText,
    required this.latencyMs,
    required this.timestamp,
    required this.success,
    this.errorMessage,
    this.requestBody,
    this.responseBody,
  });
}

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final List<ApiLogEntry> _logs = [];
  final StreamController<List<ApiLogEntry>> _logStreamController =
      StreamController<List<ApiLogEntry>>.broadcast();

  Stream<List<ApiLogEntry>> get logStream => _logStreamController.stream;
  List<ApiLogEntry> get logs => List.unmodifiable(_logs);

  void clearLogs() {
    _logs.clear();
    _logStreamController.add([]);
  }

  void _recordLog(ApiLogEntry entry) {
    _logs.insert(0, entry);
    if (_logs.length > 50) {
      _logs.removeLast();
    }
    _logStreamController.add(List.unmodifiable(_logs));
  }

  Future<dynamic> get(
    String url, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParams,
  }) async {
    Uri uri = Uri.parse(url);
    if (queryParams != null && queryParams.isNotEmpty) {
      final Map<String, String> stringParams = {};
      queryParams.forEach((key, val) {
        if (val != null) {
          stringParams[key] = val.toString();
        }
      });
      uri = uri.replace(queryParameters: {
        ...uri.queryParameters,
        ...stringParams,
      });
    }

    return _executeWithRetry('GET', uri, headers: headers);
  }

  Future<dynamic> post(
    String url, {
    Map<String, String>? headers,
    dynamic body,
  }) async {
    final uri = Uri.parse(url);
    return _executeWithRetry('POST', uri, headers: headers, body: body);
  }

  Future<dynamic> _executeWithRetry(
    String method,
    Uri uri, {
    Map<String, String>? headers,
    dynamic body,
  }) async {
    int attempt = 0;
    const maxRetries = ApiConfig.maxRetries;
    Exception? lastException;

    while (attempt <= maxRetries) {
      final stopwatch = Stopwatch()..start();
      try {
        final Map<String, String> reqHeaders = {
          'Accept': 'application/json',
          if (body != null) 'Content-Type': 'application/json',
          ...?headers,
        };

        http.Response response;
        if (method == 'POST') {
          response = await http
              .post(
                uri,
                headers: reqHeaders,
                body: body != null ? jsonEncode(body) : null,
              )
              .timeout(const Duration(seconds: ApiConfig.timeoutSeconds));
        } else {
          response = await http
              .get(uri, headers: reqHeaders)
              .timeout(const Duration(seconds: ApiConfig.timeoutSeconds));
        }

        stopwatch.stop();
        final latency = stopwatch.elapsedMilliseconds;

        dynamic responseData;
        try {
          responseData = jsonDecode(response.body);
        } catch (_) {
          responseData = response.body;
        }

        final isOk = response.statusCode >= 200 && response.statusCode < 300;

        _recordLog(ApiLogEntry(
          id: '${DateTime.now().millisecondsSinceEpoch}',
          method: method,
          url: uri.toString(),
          status: response.statusCode,
          statusText: response.reasonPhrase ?? 'Status ${response.statusCode}',
          latencyMs: latency,
          timestamp: DateTime.now().toIso8601String(),
          success: isOk,
          errorMessage: isOk ? null : 'HTTP ${response.statusCode}',
          requestBody: body,
          responseBody: responseData,
        ));

        if (!isOk) {
          if (response.statusCode >= 500 && attempt < maxRetries) {
            attempt++;
            await Future.delayed(Duration(milliseconds: 800 * attempt));
            continue;
          }
          throw Exception(
              'HTTP ${response.statusCode}: ${response.reasonPhrase ?? response.body}');
        }

        return responseData;
      } catch (e) {
        stopwatch.stop();
        lastException = e is Exception ? e : Exception(e.toString());

        if (attempt < maxRetries) {
          attempt++;
          await Future.delayed(Duration(milliseconds: 800 * attempt));
          continue;
        }

        _recordLog(ApiLogEntry(
          id: '${DateTime.now().millisecondsSinceEpoch}',
          method: method,
          url: uri.toString(),
          status: 0,
          statusText: 'Network Exception',
          latencyMs: stopwatch.elapsedMilliseconds,
          timestamp: DateTime.now().toIso8601String(),
          success: false,
          errorMessage: e.toString(),
          requestBody: body,
        ));

        rethrow;
      }
    }

    throw lastException ?? Exception('Request failed after retries');
  }
}
