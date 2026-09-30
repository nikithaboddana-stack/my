import '../config/api_config.dart';
import '../models/types.dart';
import '../utils/water_calc.dart';
import 'api_service.dart';
import 'firebase_service.dart';

class AiService {
  static final ApiService _api = ApiService();

  static Future<ChatMessage> sendMessage({
    required String message,
    required List<ChatMessage> history,
    required String userId,
    required String sessionId,
    FarmDetails? farm,
    List<WaterUsageRecord> records = const [],
    WaterAnalytics? analytics,
  }) async {
    // 1. Build real farmer context from actual Firebase records
    final List<String> recordSummaries = [];
    for (final r in records.take(5)) {
      recordSummaries.add('${r.date}: ${r.waterUsed}L on ${r.crop} via ${r.irrigationMethod}');
    }

    final farmContext = {
      'farmName': farm?.farmName,
      'crops': farm?.crops,
      'soilType': farm?.soilType,
      'irrigationMethod': farm?.irrigationMethod,
      'waterSource': farm?.waterSource,
      'farmArea': farm?.farmArea,
      'areaUnit': farm?.areaUnit,
      'cityName': farm?.cityName,
      'totalWaterLiters': analytics?.totalWaterLiters ?? 0,
      'recentRecordsCount': records.length,
      'recentRecordsSummary': recordSummaries.isNotEmpty ? recordSummaries.join('; ') : 'No records yet',
    };

    // 2. Format history turns
    final historyPayload = history.take(10).map((m) {
      return {
        'role': m.role,
        'content': m.content,
      };
    }).toList();

    // 3. Post to the secure backend endpoint (keeping Gemini API key strictly server-side)
    final endpointUrl = '${ApiConfig.backendBaseUrl}/api/chat';
    final response = await _api.post(
      endpointUrl,
      body: {
        'message': message,
        'history': historyPayload,
        'farmContext': farmContext,
        'userId': userId,
      },
    );

    if (response is! Map) {
      throw Exception('Unexpected server response format');
    }

    final reply = response['reply']?.toString() ?? 'I could not generate an answer right now.';
    final relatedGuideMap = response['relatedGuide'] as Map<dynamic, dynamic>?;

    final botMessage = ChatMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}_bot',
      role: 'model',
      content: reply,
      createdAt: DateTime.now().toIso8601String(),
      relatedGuideId: relatedGuideMap?['id']?.toString(),
      relatedGuideTitle: relatedGuideMap?['title']?.toString(),
    );

    // Save bot reply to Firebase
    await FirebaseService().saveChatMessage(userId, sessionId, botMessage);

    return botMessage;
  }
}
