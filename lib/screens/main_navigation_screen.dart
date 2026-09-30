import 'dart:async';
import 'package:flutter/material.dart';
import '../models/types.dart';
import '../services/auth_service.dart';
import '../services/firebase_service.dart';
import '../services/weather_service.dart';
import '../theme/app_theme.dart';
import '../utils/water_calc.dart';
import '../widgets/api_inspector_dialog.dart';
import '../widgets/farm_setup_dialog.dart';
import 'crops_screen.dart';
import 'dashboard_screen.dart';
import 'farmer_assistant_screen.dart';
import 'farmer_help_screen.dart';
import 'irrigation_planner_screen.dart';
import 'knowledge_library_screen.dart';
import 'water_logs_screen.dart';
import 'weather_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _activeTabIndex = 0;
  String? _pendingCropForPlanner;
  String? _targetGuideId;

  // Realtime Firebase States
  UserProfile? _userProfile;
  FarmDetails? _farm;
  List<WaterUsageRecord> _records = [];
  List<IrrigationSchedule> _schedules = [];
  List<FavoriteItem> _favorites = [];
  List<FarmerQuestion> _questions = [];

  // Weather State
  WeatherReport? _weather;
  bool _weatherLoading = false;

  final List<StreamSubscription> _subscriptions = [];

  @override
  void initState() {
    super.initState();
    AuthService().addListener(_onAuthChanged);
    _setupSubscriptions();
  }

  void _onAuthChanged() {
    _setupSubscriptions();
  }

  void _setupSubscriptions() {
    for (final s in _subscriptions) {
      s.cancel();
    }
    _subscriptions.clear();

    final user = AuthService().currentUser;
    final userId = user?.uid ?? 'farmer_local_user';

    _subscriptions.add(
      FirebaseService().streamUserProfile(userId).listen((profile) {
        if (mounted) setState(() => _userProfile = profile);
      }),
    );

    _subscriptions.add(
      FirebaseService().streamFarmDetails(userId).listen((farm) {
        if (mounted) {
          setState(() => _farm = farm);
          if (farm?.latitude != null && farm?.longitude != null) {
            _fetchWeather(farm!.latitude!, farm.longitude!, farm.cityName);
          }
        }
      }),
    );

    _subscriptions.add(
      FirebaseService().streamWaterRecords(userId).listen((recs) {
        if (mounted) setState(() => _records = recs);
      }),
    );

    _subscriptions.add(
      FirebaseService().streamSchedules(userId).listen((scheds) {
        if (mounted) setState(() => _schedules = scheds);
      }),
    );

    _subscriptions.add(
      FirebaseService().streamFavorites(userId).listen((favs) {
        if (mounted) setState(() => _favorites = favs);
      }),
    );

    _subscriptions.add(
      FirebaseService().streamFarmerQuestions(userId).listen((qs) {
        if (mounted) setState(() => _questions = qs);
      }),
    );
  }

  Future<void> _fetchWeather(double lat, double lon, String? city) async {
    setState(() => _weatherLoading = true);
    final report = await WeatherService.fetchLiveWeather(lat, lon, city);
    if (mounted) {
      setState(() {
        _weather = report;
        _weatherLoading = false;
      });
    }
  }

  @override
  void dispose() {
    AuthService().removeListener(_onAuthChanged);
    for (final s in _subscriptions) {
      s.cancel();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService().currentUser;
    final userId = user?.uid ?? 'farmer_local_user';
    final analytics = calculateWaterAnalytics(_records, _farm);

    final screens = [
      // 0: Dashboard
      DashboardScreen(
        farm: _farm,
        analytics: analytics,
        records: _records,
        schedules: _schedules,
        weather: _weather,
        weatherLoading: _weatherLoading,
        onRefreshWeather: () {
          if (_farm?.latitude != null && _farm?.longitude != null) {
            _fetchWeather(_farm!.latitude!, _farm!.longitude!, _farm!.cityName);
          }
        },
        onNavigateTab: (idx) => setState(() => _activeTabIndex = idx),
        userId: userId,
      ),

      // 1: Crops
      CropsScreen(
        onPlanForCrop: (crop) {
          setState(() {
            _pendingCropForPlanner = crop;
            _activeTabIndex = 3; // Switch to Planner
          });
        },
        userId: userId,
      ),

      // 2: Logs
      WaterLogsScreen(
        records: _records,
        userId: userId,
        onNavigateToKnowledge: () => setState(() => _activeTabIndex = 7),
      ),

      // 3: Planner
      IrrigationPlannerScreen(
        schedules: _schedules,
        weather: _weather,
        userId: userId,
        defaultCrop: _pendingCropForPlanner ?? '',
      ),

      // 4: Weather
      WeatherScreen(
        weather: _weather,
        loading: _weatherLoading,
        onRefresh: () {
          if (_farm?.latitude != null && _farm?.longitude != null) {
            _fetchWeather(_farm!.latitude!, _farm!.longitude!, _farm!.cityName);
          }
        },
        onLocationChange: (lat, lon, city) {
          _fetchWeather(lat, lon, city);
          if (_farm != null) {
            FirebaseService().saveFarmDetails(_farm!.copyWith(
              latitude: lat,
              longitude: lon,
              cityName: city,
            ));
          } else {
            FirebaseService().saveFarmDetails(FarmDetails(
              userId: userId,
              farmName: 'My Farm',
              latitude: lat,
              longitude: lon,
              cityName: city,
            ));
          }
        },
      ),

      // 5: AgriFlow Assistant
      FarmerAssistantScreen(
        userId: userId,
        farm: _farm,
        records: _records,
        analytics: analytics,
        onNavigateToKnowledge: (guideId) {
          setState(() {
            _targetGuideId = guideId;
            _activeTabIndex = 7;
          });
        },
        onNavigateToRecords: () => setState(() => _activeTabIndex = 2),
      ),

      // 6: Help
      FarmerHelpScreen(
        questions: _questions,
        userId: userId,
        onNavigateToKnowledge: () => setState(() => _activeTabIndex = 7),
        onNavigateToCrops: () => setState(() => _activeTabIndex = 1),
      ),

      // 7: Library
      KnowledgeLibraryScreen(
        favorites: _favorites,
        userId: userId,
        onNavigateTab: (idx) => setState(() => _activeTabIndex = idx),
        initialArticleId: _targetGuideId,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.water_drop, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'AgriFlow Real-Time',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.gray900),
                ),
                Text(
                  _farm?.farmName != null ? '🌱 ${_farm!.farmName}' : 'Farm Water Companion',
                  style: const TextStyle(fontSize: 11, color: AppColors.emerald800, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Inspector button
          IconButton(
            icon: const Icon(Icons.network_check, size: 20, color: AppColors.teal700),
            tooltip: 'API Inspector',
            onPressed: () => showDialog(
              context: context,
              builder: (_) => const ApiInspectorDialog(),
            ),
          ),

          // User login / profile
          if (user != null) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: InkWell(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (_) => FarmSetupDialog(userId: userId, existingFarm: _farm),
                  );
                },
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.gray200),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundColor: AppColors.emerald700,
                        child: Text(
                          (user.displayName != null && user.displayName!.isNotEmpty)
                              ? user.displayName![0].toUpperCase()
                              : 'F',
                          style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        _userProfile?.name ?? user.displayName ?? 'Farmer',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.gray800),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.logout, size: 18, color: AppColors.gray500),
              tooltip: 'Sign Out',
              onPressed: () => AuthService().signOut(),
            ),
          ] else ...[
            ElevatedButton.icon(
              onPressed: () => AuthService().signInAsFarmer(),
              icon: const Icon(Icons.login, size: 16),
              label: const Text('Farmer Sign In'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.emerald700,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
            ),
          ],
          const SizedBox(width: 8),
        ],
      ),
      body: screens[_activeTabIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: AppColors.gray200)),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.dashboard_outlined, Icons.dashboard, 'Home'),
                _buildNavItem(1, Icons.grass_outlined, Icons.grass, 'Crops'),
                _buildNavItem(2, Icons.opacity_outlined, Icons.opacity, 'Logs'),
                _buildNavItem(3, Icons.calendar_today_outlined, Icons.calendar_today, 'Planner'),
                _buildNavItem(4, Icons.cloud_outlined, Icons.cloud, 'Weather'),
                _buildNavItem(5, Icons.smart_toy_outlined, Icons.smart_toy, 'AI Bot'),
                _buildNavItem(6, Icons.help_outline, Icons.help, 'Help'),
                _buildNavItem(7, Icons.menu_book_outlined, Icons.menu_book, 'Library'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, IconData activeIcon, String label) {
    final isSel = _activeTabIndex == index;
    return InkWell(
      onTap: () {
        setState(() {
          _activeTabIndex = index;
          if (index != 3) _pendingCropForPlanner = null;
          if (index != 7) _targetGuideId = null;
        });
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSel ? activeIcon : icon,
              size: 22,
              color: isSel ? AppColors.emerald700 : AppColors.gray400,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                color: isSel ? AppColors.emerald800 : AppColors.gray500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
