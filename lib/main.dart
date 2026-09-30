import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';
import 'screens/main_navigation_screen.dart';
import 'services/auth_service.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (e) {
    // If running in an environment where Firebase fails or offline,
    // the application gracefully falls back to local authenticated state.
    debugPrint('Firebase initialize warning: $e');
  }

  AuthService().init();

  runApp(const AgriFlowApp());
}

class AgriFlowApp extends StatelessWidget {
  const AgriFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<AuthService>.value(
      value: AuthService(),
      child: MaterialApp(
        title: 'AgriFlow Real-Time - Farm Water Management',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const MainNavigationScreen(),
      ),
    );
  }
}
