/// Core data models for AgriFlow Water Management

typedef SoilType = String;
const List<String> kSoilTypes = [
  'Loam',
  'Clay',
  'Sandy',
  'Silt',
  'Peat',
  'Saline',
];

typedef IrrigationMethod = String;
const List<String> kIrrigationMethods = [
  'Drip Irrigation',
  'Sprinkler System',
  'Furrow Irrigation',
  'Flood / Basin Irrigation',
  'Sub-surface Drip',
  'Micro-sprinkler',
];

typedef WaterSource = String;
const List<String> kWaterSources = [
  'Borewell / Groundwater',
  'Canal / Irrigation Network',
  'River / Stream',
  'Rainwater Harvesting Pond',
  'Municipal / Tanker Supply',
];

class UserProfile {
  final String userId;
  final String name;
  final String email;
  final String? location;
  final String createdAt;
  final String? updatedAt;

  UserProfile({
    required this.userId,
    required this.name,
    required this.email,
    this.location,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() => {
        'userId': userId,
        'name': name,
        'email': email,
        'location': location,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };

  factory UserProfile.fromMap(Map<dynamic, dynamic> map, String id) {
    return UserProfile(
      userId: (map['userId'] ?? id).toString(),
      name: (map['name'] ?? 'Farmer').toString(),
      email: (map['email'] ?? '').toString(),
      location: map['location']?.toString(),
      createdAt: (map['createdAt'] ?? DateTime.now().toIso8601String()).toString(),
      updatedAt: map['updatedAt']?.toString(),
    );
  }
}

class FarmDetails {
  final String userId;
  final String farmName;
  final double? farmArea;
  final String areaUnit;
  final String? soilType;
  final String? crops;
  final String? irrigationMethod;
  final String? waterSource;
  final double? latitude;
  final double? longitude;
  final String? cityName;
  final String? updatedAt;

  FarmDetails({
    required this.userId,
    required this.farmName,
    this.farmArea,
    this.areaUnit = 'acres',
    this.soilType,
    this.crops,
    this.irrigationMethod,
    this.waterSource,
    this.latitude,
    this.longitude,
    this.cityName,
    this.updatedAt,
  });

  FarmDetails copyWith({
    String? farmName,
    double? farmArea,
    String? areaUnit,
    String? soilType,
    String? crops,
    String? irrigationMethod,
    String? waterSource,
    double? latitude,
    double? longitude,
    String? cityName,
    String? updatedAt,
  }) {
    return FarmDetails(
      userId: userId,
      farmName: farmName ?? this.farmName,
      farmArea: farmArea ?? this.farmArea,
      areaUnit: areaUnit ?? this.areaUnit,
      soilType: soilType ?? this.soilType,
      crops: crops ?? this.crops,
      irrigationMethod: irrigationMethod ?? this.irrigationMethod,
      waterSource: waterSource ?? this.waterSource,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      cityName: cityName ?? this.cityName,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toMap() => {
        'userId': userId,
        'farmName': farmName,
        'farmArea': farmArea,
        'areaUnit': areaUnit,
        'soilType': soilType,
        'crops': crops,
        'irrigationMethod': irrigationMethod,
        'waterSource': waterSource,
        'latitude': latitude,
        'longitude': longitude,
        'cityName': cityName,
        'updatedAt': updatedAt,
      };

  factory FarmDetails.fromMap(Map<dynamic, dynamic> map, String id) {
    return FarmDetails(
      userId: (map['userId'] ?? id).toString(),
      farmName: (map['farmName'] ?? 'My Farm').toString(),
      farmArea: map['farmArea'] != null ? (map['farmArea'] as num).toDouble() : null,
      areaUnit: (map['areaUnit'] ?? 'acres').toString(),
      soilType: map['soilType']?.toString(),
      crops: map['crops']?.toString(),
      irrigationMethod: map['irrigationMethod']?.toString(),
      waterSource: map['waterSource']?.toString(),
      latitude: map['latitude'] != null ? (map['latitude'] as num).toDouble() : null,
      longitude: map['longitude'] != null ? (map['longitude'] as num).toDouble() : null,
      cityName: map['cityName']?.toString(),
      updatedAt: map['updatedAt']?.toString(),
    );
  }
}

class WaterUsageRecord {
  final String id;
  final String userId;
  final String crop;
  final String date;
  final double waterUsed; // in liters
  final String unit; // 'Liters' | 'Gallons' | 'Cubic Meters (m³)'
  final String irrigationMethod;
  final double? durationHours;
  final double? areaCovered;
  final String? notes;
  final String createdAt;

  WaterUsageRecord({
    required this.id,
    required this.userId,
    required this.crop,
    required this.date,
    required this.waterUsed,
    this.unit = 'Liters',
    required this.irrigationMethod,
    this.durationHours,
    this.areaCovered,
    this.notes,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() => {
        'id': id,
        'userId': userId,
        'crop': crop,
        'date': date,
        'waterUsed': waterUsed,
        'unit': unit,
        'irrigationMethod': irrigationMethod,
        'durationHours': durationHours,
        'areaCovered': areaCovered,
        'notes': notes,
        'createdAt': createdAt,
      };

  factory WaterUsageRecord.fromMap(Map<dynamic, dynamic> map, String id) {
    return WaterUsageRecord(
      id: (map['id'] ?? id).toString(),
      userId: (map['userId'] ?? '').toString(),
      crop: (map['crop'] ?? 'Crop').toString(),
      date: (map['date'] ?? '').toString(),
      waterUsed: (map['waterUsed'] as num?)?.toDouble() ?? 0.0,
      unit: (map['unit'] ?? 'Liters').toString(),
      irrigationMethod: (map['irrigationMethod'] ?? 'Drip Irrigation').toString(),
      durationHours: map['durationHours'] != null ? (map['durationHours'] as num).toDouble() : null,
      areaCovered: map['areaCovered'] != null ? (map['areaCovered'] as num).toDouble() : null,
      notes: map['notes']?.toString(),
      createdAt: (map['createdAt'] ?? DateTime.now().toIso8601String()).toString(),
    );
  }
}

class FavoriteItem {
  final String itemId;
  final String userId;
  final String title;
  final String category;
  final String savedAt;

  FavoriteItem({
    required this.itemId,
    required this.userId,
    required this.title,
    required this.category,
    required this.savedAt,
  });

  Map<String, dynamic> toMap() => {
        'itemId': itemId,
        'userId': userId,
        'title': title,
        'category': category,
        'savedAt': savedAt,
      };

  factory FavoriteItem.fromMap(Map<dynamic, dynamic> map, String id) {
    return FavoriteItem(
      itemId: (map['itemId'] ?? id).toString(),
      userId: (map['userId'] ?? '').toString(),
      title: (map['title'] ?? '').toString(),
      category: (map['category'] ?? '').toString(),
      savedAt: (map['savedAt'] ?? '').toString(),
    );
  }
}

class IrrigationSchedule {
  final String id;
  final String userId;
  final String crop;
  final String scheduledDate;
  final String? scheduledTime;
  final double? plannedWater;
  final double? durationHours;
  final String? irrigationMethod;
  final String? notes;
  final String status; // 'pending' | 'completed' | 'skipped_weather' | 'cancelled'
  final String? weatherAlert;
  final String createdAt;

  IrrigationSchedule({
    required this.id,
    required this.userId,
    required this.crop,
    required this.scheduledDate,
    this.scheduledTime,
    this.plannedWater,
    this.durationHours,
    this.irrigationMethod,
    this.notes,
    this.status = 'pending',
    this.weatherAlert,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() => {
        'id': id,
        'userId': userId,
        'crop': crop,
        'scheduledDate': scheduledDate,
        'scheduledTime': scheduledTime,
        'plannedWater': plannedWater,
        'durationHours': durationHours,
        'irrigationMethod': irrigationMethod,
        'notes': notes,
        'status': status,
        'weatherAlert': weatherAlert,
        'createdAt': createdAt,
      };

  factory IrrigationSchedule.fromMap(Map<dynamic, dynamic> map, String id) {
    return IrrigationSchedule(
      id: (map['id'] ?? id).toString(),
      userId: (map['userId'] ?? '').toString(),
      crop: (map['crop'] ?? '').toString(),
      scheduledDate: (map['scheduledDate'] ?? '').toString(),
      scheduledTime: map['scheduledTime']?.toString(),
      plannedWater: map['plannedWater'] != null ? (map['plannedWater'] as num).toDouble() : null,
      durationHours: map['durationHours'] != null ? (map['durationHours'] as num).toDouble() : null,
      irrigationMethod: map['irrigationMethod']?.toString(),
      notes: map['notes']?.toString(),
      status: (map['status'] ?? 'pending').toString(),
      weatherAlert: map['weatherAlert']?.toString(),
      createdAt: (map['createdAt'] ?? '').toString(),
    );
  }
}

class FarmerQuestion {
  final String id;
  final String userId;
  final String question;
  final String crop;
  final String category; // 'Irrigation & Water' | 'Leaf / Crop Health' | 'Soil & Moisture' | 'Pest & Growth' | 'General'
  final String status; // 'Open' | 'Reviewed'
  final String? adviceNotes;
  final String createdAt;

  FarmerQuestion({
    required this.id,
    required this.userId,
    required this.question,
    required this.crop,
    required this.category,
    this.status = 'Open',
    this.adviceNotes,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() => {
        'id': id,
        'userId': userId,
        'question': question,
        'crop': crop,
        'category': category,
        'status': status,
        'adviceNotes': adviceNotes,
        'createdAt': createdAt,
      };

  factory FarmerQuestion.fromMap(Map<dynamic, dynamic> map, String id) {
    return FarmerQuestion(
      id: (map['id'] ?? id).toString(),
      userId: (map['userId'] ?? '').toString(),
      question: (map['question'] ?? '').toString(),
      crop: (map['crop'] ?? '').toString(),
      category: (map['category'] ?? 'General').toString(),
      status: (map['status'] ?? 'Open').toString(),
      adviceNotes: map['adviceNotes']?.toString(),
      createdAt: (map['createdAt'] ?? '').toString(),
    );
  }
}

class ChatMessage {
  final String id;
  final String role; // 'user' | 'model'
  final String content;
  final String createdAt;
  final String? relatedGuideId;
  final String? relatedGuideTitle;

  ChatMessage({
    required this.id,
    required this.role,
    required this.content,
    required this.createdAt,
    this.relatedGuideId,
    this.relatedGuideTitle,
  });

  Map<String, dynamic> toMap() => {
        'id': id,
        'role': role,
        'content': content,
        'createdAt': createdAt,
        'relatedGuide': relatedGuideId != null
            ? {'id': relatedGuideId, 'title': relatedGuideTitle}
            : null,
      };

  factory ChatMessage.fromMap(Map<dynamic, dynamic> map, String id) {
    final guideMap = map['relatedGuide'] as Map<dynamic, dynamic>?;
    return ChatMessage(
      id: (map['id'] ?? id).toString(),
      role: (map['role'] ?? 'user').toString(),
      content: (map['content'] ?? '').toString(),
      createdAt: (map['createdAt'] ?? DateTime.now().toIso8601String()).toString(),
      relatedGuideId: guideMap?['id']?.toString(),
      relatedGuideTitle: guideMap?['title']?.toString(),
    );
  }
}

class CurrentWeather {
  final int temperature;
  final int humidity;
  final int windSpeed;
  final int weatherCode;
  final String weatherDescription;
  final int rainProbability;
  final bool isRaining;
  final double precipitation;
  final String timestamp;

  CurrentWeather({
    required this.temperature,
    required this.humidity,
    required this.windSpeed,
    required this.weatherCode,
    required this.weatherDescription,
    required this.rainProbability,
    required this.isRaining,
    required this.precipitation,
    required this.timestamp,
  });
}

class DailyForecastItem {
  final String date;
  final int tempMax;
  final int tempMin;
  final int precipitationProbability;
  final double precipitationSum;
  final int weatherCode;
  final String? advisory;

  DailyForecastItem({
    required this.date,
    required this.tempMax,
    required this.tempMin,
    required this.precipitationProbability,
    required this.precipitationSum,
    required this.weatherCode,
    this.advisory,
  });
}

class WeatherReport {
  final String city;
  final double latitude;
  final double longitude;
  final CurrentWeather current;
  final List<DailyForecastItem> forecast;
  final String agriAdvice;
  final bool isLive;
  final String fetchedAt;
  final String source;

  WeatherReport({
    required this.city,
    required this.latitude,
    required this.longitude,
    required this.current,
    required this.forecast,
    required this.agriAdvice,
    required this.isLive,
    required this.fetchedAt,
    required this.source,
  });
}

class CropGrowthStage {
  final String stage;
  final String waterNeed; // 'Low' | 'Moderate' | 'High' | 'Critical'
  final String description;

  const CropGrowthStage({
    required this.stage,
    required this.waterNeed,
    required this.description,
  });
}

class CropDetail {
  final String id;
  final String name;
  final String icon;
  final String category; // 'Grain' | 'Vegetable' | 'Commercial' | 'Fruit' | 'Legume'
  final String overview;
  final String waterConsiderations;
  final List<CropGrowthStage> growthStages;
  final List<String> suitableMethods;
  final String weatherConsiderations;
  final List<String> commonProblems;
  final List<String> waterSavingTips;

  const CropDetail({
    required this.id,
    required this.name,
    required this.icon,
    required this.category,
    required this.overview,
    required this.waterConsiderations,
    required this.growthStages,
    required this.suitableMethods,
    required this.weatherConsiderations,
    required this.commonProblems,
    required this.waterSavingTips,
  });
}

class CropWaterBenchmark {
  final String crop;
  final String waterPerHaM3;
  final String recommendedMethod;
  final String criticalStage;

  const CropWaterBenchmark({
    required this.crop,
    required this.waterPerHaM3,
    required this.recommendedMethod,
    required this.criticalStage,
  });
}

class ArticleRelatedTool {
  final String label;
  final String targetTab;
  final String description;

  const ArticleRelatedTool({
    required this.label,
    required this.targetTab,
    required this.description,
  });
}

class KnowledgeArticle {
  final String id;
  final String title;
  final String category;
  final String problemCategory;
  final String readTime;
  final String benefitLabel;
  final List<String> keywords;
  final String whatIsIt;
  final String? howWaterReachesRoots;
  final List<String>? benefits;
  final String whyItMatters;
  final List<String> whatCanFarmerDo;
  final String? filtrationAndPressure;
  final String? lateralFlushingAndInspection;
  final List<String>? signsOfClogging;
  final List<String>? maintenanceSteps;
  final List<String> thingsToCheck;
  final String importantCaution;
  final ArticleRelatedTool relatedTool;
  final List<String> references;

  const KnowledgeArticle({
    required this.id,
    required this.title,
    required this.category,
    required this.problemCategory,
    required this.readTime,
    required this.benefitLabel,
    required this.keywords,
    required this.whatIsIt,
    this.howWaterReachesRoots,
    this.benefits,
    required this.whyItMatters,
    required this.whatCanFarmerDo,
    this.filtrationAndPressure,
    this.lateralFlushingAndInspection,
    this.signsOfClogging,
    this.maintenanceSteps,
    required this.thingsToCheck,
    required this.importantCaution,
    required this.relatedTool,
    required this.references,
  });
}

class ProblemCategoryItem {
  final String id;
  final String icon;
  final String title;
  final String description;
  final String color;

  const ProblemCategoryItem({
    required this.id,
    required this.icon,
    required this.title,
    required this.description,
    required this.color,
  });
}
