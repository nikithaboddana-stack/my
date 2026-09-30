import 'package:flutter/material.dart';

class AppColors {
  static const Color emerald900 = Color(0xFF064E3B);
  static const Color emerald800 = Color(0xFF065F46);
  static const Color emerald700 = Color(0xFF047857);
  static const Color emerald600 = Color(0xFF059669);
  static const Color emerald500 = Color(0xFF10B981);
  static const Color emerald100 = Color(0xFFD1FAE5);
  static const Color emerald50 = Color(0xFFECFDF5);

  static const Color teal700 = Color(0xFF0F766E);
  static const Color teal600 = Color(0xFF0D9488);
  static const Color teal500 = Color(0xFF14B8A6);
  static const Color teal50 = Color(0xFFF0FDFA);

  static const Color sky700 = Color(0xFF0369A1);
  static const Color sky500 = Color(0xFF0EA5E9);
  static const Color sky50 = Color(0xFFF0F9FF);

  static const Color amber700 = Color(0xFFB45309);
  static const Color amber500 = Color(0xFFF59E0B);
  static const Color amber50 = Color(0xFFFFFBEB);

  static const Color gray900 = Color(0xFF111827);
  static const Color gray800 = Color(0xFF1F2937);
  static const Color gray700 = Color(0xFF374151);
  static const Color gray600 = Color(0xFF4B5563);
  static const Color gray500 = Color(0xFF6B7280);
  static const Color gray400 = Color(0xFF9CA3AF);
  static const Color gray200 = Color(0xFFE5E7EB);
  static const Color gray100 = Color(0xFFF3F4F6);
  static const Color gray50 = Color(0xFFF9FAFB);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [emerald700, teal700],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFFE6F4EA), Color(0xFFE0F2F1), Color(0xFFE1F5FE)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient botGradient = LinearGradient(
    colors: [emerald600, teal500, sky500],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.emerald700,
        primary: AppColors.emerald700,
        secondary: AppColors.teal700,
        surface: Colors.white,
      ),
      scaffoldBackgroundColor: const Color(0xFFF6FAF7),
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: AppColors.gray800),
        titleTextStyle: TextStyle(
          color: AppColors.gray900,
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFFEAEFF2), width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.emerald700,
          foregroundColor: Colors.white,
          elevation: 1,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.gray200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.gray200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.emerald600, width: 2),
        ),
      ),
    );
  }
}
