import 'dart:async';
import 'package:firebase_database/firebase_database.dart';
import '../models/types.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  final FirebaseDatabase _db = FirebaseDatabase.instance;

  // In-memory local stores for offline support & seamless fallback
  final Map<String, UserProfile> _localUsers = {};
  final Map<String, FarmDetails> _localFarms = {};
  final Map<String, List<WaterUsageRecord>> _localRecords = {};
  final Map<String, List<IrrigationSchedule>> _localSchedules = {};
  final Map<String, List<FavoriteItem>> _localFavorites = {};
  final Map<String, List<FarmerQuestion>> _localQuestions = {};
  final Map<String, List<ChatMessage>> _localMessages = {};

  // 1. User Profile
  Future<void> saveUserProfile(UserProfile profile) async {
    _localUsers[profile.userId] = profile;
    try {
      final ref = _db.ref('users/${profile.userId}');
      await ref.set(profile.toMap());
    } catch (_) {}
  }

  Stream<UserProfile?> streamUserProfile(String userId) {
    try {
      final ref = _db.ref('users/$userId');
      return ref.onValue.map((event) {
        if (event.snapshot.value != null && event.snapshot.value is Map) {
          final map = event.snapshot.value as Map<dynamic, dynamic>;
          final profile = UserProfile.fromMap(map, userId);
          _localUsers[userId] = profile;
          return profile;
        }
        return _localUsers[userId];
      }).handleError((_) => _localUsers[userId]);
    } catch (_) {
      return Stream.value(_localUsers[userId]);
    }
  }

  // 2. Farm Details
  Future<void> saveFarmDetails(FarmDetails farm) async {
    _localFarms[farm.userId] = farm;
    try {
      final ref = _db.ref('farms/${farm.userId}');
      await ref.set(farm.toMap());
    } catch (_) {}
  }

  Stream<FarmDetails?> streamFarmDetails(String userId) {
    try {
      final ref = _db.ref('farms/$userId');
      return ref.onValue.map((event) {
        if (event.snapshot.value != null && event.snapshot.value is Map) {
          final map = event.snapshot.value as Map<dynamic, dynamic>;
          final farm = FarmDetails.fromMap(map, userId);
          _localFarms[userId] = farm;
          return farm;
        }
        return _localFarms[userId];
      }).handleError((_) => _localFarms[userId]);
    } catch (_) {
      return Stream.value(_localFarms[userId]);
    }
  }

  // 3. Water Records
  Future<void> addWaterRecord(WaterUsageRecord record) async {
    _localRecords.putIfAbsent(record.userId, () => []);
    _localRecords[record.userId]!.insert(0, record);
    try {
      final ref = _db.ref('waterUsage/${record.userId}/records/${record.id}');
      await ref.set(record.toMap());
    } catch (_) {}
  }

  Future<void> deleteWaterRecord(String userId, String recordId) async {
    _localRecords[userId]?.removeWhere((r) => r.id == recordId);
    try {
      final ref = _db.ref('waterUsage/$userId/records/$recordId');
      await ref.remove();
    } catch (_) {}
  }

  Stream<List<WaterUsageRecord>> streamWaterRecords(String userId) {
    try {
      final ref = _db.ref('waterUsage/$userId/records');
      return ref.onValue.map((event) {
        final val = event.snapshot.value;
        if (val != null && val is Map) {
          final List<WaterUsageRecord> list = [];
          val.forEach((key, map) {
            if (map is Map) {
              list.add(WaterUsageRecord.fromMap(map, key.toString()));
            }
          });
          list.sort((a, b) => b.date.compareTo(a.date));
          _localRecords[userId] = list;
          return list;
        }
        return _localRecords[userId] ?? [];
      }).handleError((_) => _localRecords[userId] ?? []);
    } catch (_) {
      return Stream.value(_localRecords[userId] ?? []);
    }
  }

  // 4. Irrigation Schedules
  Future<void> addIrrigationSchedule(IrrigationSchedule schedule) async {
    _localSchedules.putIfAbsent(schedule.userId, () => []);
    _localSchedules[schedule.userId]!.add(schedule);
    try {
      final ref = _db.ref('irrigationSchedules/${schedule.userId}/${schedule.id}');
      await ref.set(schedule.toMap());
    } catch (_) {}
  }

  Future<void> updateScheduleStatus(
    String userId,
    String scheduleId,
    String status, {
    String? weatherAlert,
  }) async {
    final list = _localSchedules[userId];
    if (list != null) {
      final idx = list.indexWhere((s) => s.id == scheduleId);
      if (idx != -1) {
        final old = list[idx];
        list[idx] = IrrigationSchedule(
          id: old.id,
          userId: old.userId,
          crop: old.crop,
          scheduledDate: old.scheduledDate,
          scheduledTime: old.scheduledTime,
          plannedWater: old.plannedWater,
          durationHours: old.durationHours,
          irrigationMethod: old.irrigationMethod,
          notes: old.notes,
          status: status,
          weatherAlert: weatherAlert ?? old.weatherAlert,
          createdAt: old.createdAt,
        );
      }
    }
    try {
      final ref = _db.ref('irrigationSchedules/$userId/$scheduleId');
      final Map<String, dynamic> updates = {'status': status};
      if (weatherAlert != null) updates['weatherAlert'] = weatherAlert;
      await ref.update(updates);
    } catch (_) {}
  }

  Future<void> deleteIrrigationSchedule(String userId, String scheduleId) async {
    _localSchedules[userId]?.removeWhere((s) => s.id == scheduleId);
    try {
      final ref = _db.ref('irrigationSchedules/$userId/$scheduleId');
      await ref.remove();
    } catch (_) {}
  }

  Stream<List<IrrigationSchedule>> streamSchedules(String userId) {
    try {
      final ref = _db.ref('irrigationSchedules/$userId');
      return ref.onValue.map((event) {
        final val = event.snapshot.value;
        if (val != null && val is Map) {
          final List<IrrigationSchedule> list = [];
          val.forEach((key, map) {
            if (map is Map) {
              list.add(IrrigationSchedule.fromMap(map, key.toString()));
            }
          });
          list.sort((a, b) => a.scheduledDate.compareTo(b.scheduledDate));
          _localSchedules[userId] = list;
          return list;
        }
        return _localSchedules[userId] ?? [];
      }).handleError((_) => _localSchedules[userId] ?? []);
    } catch (_) {
      return Stream.value(_localSchedules[userId] ?? []);
    }
  }

  // 5. Favorites
  Future<void> toggleFavoriteItem(
    String userId,
    FavoriteItem item,
    bool isCurrentlySaved,
  ) async {
    _localFavorites.putIfAbsent(userId, () => []);
    if (isCurrentlySaved) {
      _localFavorites[userId]!.removeWhere((f) => f.itemId == item.itemId);
    } else {
      _localFavorites[userId]!.add(item);
    }

    try {
      final ref = _db.ref('favorites/$userId/${item.itemId}');
      if (isCurrentlySaved) {
        await ref.remove();
      } else {
        await ref.set(item.toMap());
      }
    } catch (_) {}
  }

  Stream<List<FavoriteItem>> streamFavorites(String userId) {
    try {
      final ref = _db.ref('favorites/$userId');
      return ref.onValue.map((event) {
        final val = event.snapshot.value;
        if (val != null && val is Map) {
          final List<FavoriteItem> list = [];
          val.forEach((key, map) {
            if (map is Map) {
              list.add(FavoriteItem.fromMap(map, key.toString()));
            }
          });
          _localFavorites[userId] = list;
          return list;
        }
        return _localFavorites[userId] ?? [];
      }).handleError((_) => _localFavorites[userId] ?? []);
    } catch (_) {
      return Stream.value(_localFavorites[userId] ?? []);
    }
  }

  // 6. Farmer Questions
  Future<void> addFarmerQuestion(FarmerQuestion question) async {
    _localQuestions.putIfAbsent(question.userId, () => []);
    _localQuestions[question.userId]!.insert(0, question);
    try {
      final ref = _db.ref('farmerQuestions/${question.userId}/${question.id}');
      await ref.set(question.toMap());
    } catch (_) {}
  }

  Future<void> deleteFarmerQuestion(String userId, String questionId) async {
    _localQuestions[userId]?.removeWhere((q) => q.id == questionId);
    try {
      final ref = _db.ref('farmerQuestions/$userId/$questionId');
      await ref.remove();
    } catch (_) {}
  }

  Stream<List<FarmerQuestion>> streamFarmerQuestions(String userId) {
    try {
      final ref = _db.ref('farmerQuestions/$userId');
      return ref.onValue.map((event) {
        final val = event.snapshot.value;
        if (val != null && val is Map) {
          final List<FarmerQuestion> list = [];
          val.forEach((key, map) {
            if (map is Map) {
              list.add(FarmerQuestion.fromMap(map, key.toString()));
            }
          });
          list.sort((a, b) => b.createdAt.compareTo(a.createdAt));
          _localQuestions[userId] = list;
          return list;
        }
        return _localQuestions[userId] ?? [];
      }).handleError((_) => _localQuestions[userId] ?? []);
    } catch (_) {
      return Stream.value(_localQuestions[userId] ?? []);
    }
  }

  // 7. Chat Sessions & Messages
  Future<void> saveChatMessage(
    String userId,
    String sessionId,
    ChatMessage message,
  ) async {
    _localMessages.putIfAbsent(sessionId, () => []);
    _localMessages[sessionId]!.add(message);
    try {
      final ref = _db.ref(
          'chatSessions/$userId/sessions/$sessionId/messages/${message.id}');
      await ref.set(message.toMap());
    } catch (_) {}
  }

  Future<void> clearChatSession(String userId, String sessionId) async {
    _localMessages[sessionId]?.clear();
    try {
      final ref = _db.ref('chatSessions/$userId/sessions/$sessionId');
      await ref.remove();
    } catch (_) {}
  }

  Stream<List<ChatMessage>> streamChatMessages(String userId, String sessionId) {
    try {
      final ref = _db.ref('chatSessions/$userId/sessions/$sessionId/messages');
      return ref.onValue.map((event) {
        final val = event.snapshot.value;
        if (val != null && val is Map) {
          final List<ChatMessage> list = [];
          val.forEach((key, map) {
            if (map is Map) {
              list.add(ChatMessage.fromMap(map, key.toString()));
            }
          });
          list.sort((a, b) => a.createdAt.compareTo(b.createdAt));
          _localMessages[sessionId] = list;
          return list;
        }
        return _localMessages[sessionId] ?? [];
      }).handleError((_) => _localMessages[sessionId] ?? []);
    } catch (_) {
      return Stream.value(_localMessages[sessionId] ?? []);
    }
  }
}
