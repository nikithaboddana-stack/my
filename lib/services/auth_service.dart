import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import '../models/types.dart';
import 'firebase_service.dart';

class FarmerAuthUser {
  final String uid;
  final String? email;
  final String? displayName;
  final bool isGuest;

  FarmerAuthUser({
    required this.uid,
    this.email,
    this.displayName,
    this.isGuest = false,
  });
}

class AuthService extends ChangeNotifier {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  FarmerAuthUser? _currentUser;
  bool _loading = true;

  FarmerAuthUser? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoading => _loading;

  void init() {
    try {
      _auth.authStateChanges().listen((User? user) {
        if (user != null) {
          _currentUser = FarmerAuthUser(
            uid: user.uid,
            email: user.email,
            displayName: user.displayName ?? (user.email != null ? user.email!.split('@')[0] : 'Farmer'),
            isGuest: user.isAnonymous,
          );
        } else if (_currentUser != null && _currentUser!.isGuest) {
          // Keep guest user if local guest signed in
        } else {
          _currentUser = null;
        }
        _loading = false;
        notifyListeners();
      }, onError: (_) {
        _loading = false;
        notifyListeners();
      });
    } catch (_) {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> signInAsFarmer({String name = 'Farmer', String email = 'farmer@agriflow.local'}) async {
    _loading = true;
    notifyListeners();

    try {
      // Try anonymous or credential sign in
      final cred = await _auth.signInAnonymously();
      _currentUser = FarmerAuthUser(
        uid: cred.user?.uid ?? 'farmer_local_user',
        email: email,
        displayName: name,
        isGuest: true,
      );
    } catch (_) {
      // Offline / guest fallback
      _currentUser = FarmerAuthUser(
        uid: 'farmer_local_user',
        email: email,
        displayName: name,
        isGuest: true,
      );
    }

    if (_currentUser != null) {
      await FirebaseService().saveUserProfile(UserProfile(
        userId: _currentUser!.uid,
        name: _currentUser!.displayName ?? 'Farmer',
        email: _currentUser!.email ?? '',
        createdAt: DateTime.now().toIso8601String(),
      ));
    }

    _loading = false;
    notifyListeners();
  }

  Future<void> signOut() async {
    try {
      await _auth.signOut();
    } catch (_) {}
    _currentUser = null;
    notifyListeners();
  }
}
