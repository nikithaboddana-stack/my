import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
/// Configured for project: water-management-81897
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        return web;
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyAZzNVCzeWRmQlyvD0Vg1FO9zHkIZYv-KY',
    appId: '1:821848500487:web:48bbc70b79c8ff7e577da2',
    messagingSenderId: '821848500487',
    projectId: 'water-management-81897',
    authDomain: 'water-management-81897.firebaseapp.com',
    databaseURL: 'https://water-management-81897-default-rtdb.firebaseio.com',
    storageBucket: 'water-management-81897.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyAZzNVCzeWRmQlyvD0Vg1FO9zHkIZYv-KY',
    appId: '1:821848500487:android:b2a95c478a846c1e95',
    messagingSenderId: '821848500487',
    projectId: 'water-management-81897',
    databaseURL: 'https://water-management-81897-default-rtdb.firebaseio.com',
    storageBucket: 'water-management-81897.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyAZzNVCzeWRmQlyvD0Vg1FO9zHkIZYv-KY',
    appId: '1:821848500487:ios:watermanagement',
    messagingSenderId: '821848500487',
    projectId: 'water-management-81897',
    databaseURL: 'https://water-management-81897-default-rtdb.firebaseio.com',
    storageBucket: 'water-management-81897.appspot.com',
  );
}
