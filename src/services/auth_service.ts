import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { UserProfile } from '../models/types';
import { auth, saveUserProfile } from './firebase_service';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Persist/sync initial user profile to Firebase
    const profile: UserProfile = {
      userId: user.uid,
      name: user.displayName || 'Farmer',
      email: user.email || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveUserProfile(profile);

    return user;
  } catch (error: unknown) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuthState(
  onUserChanged: (user: User | null) => void,
  onError?: (error: Error) => void
): () => void {
  return onAuthStateChanged(auth, onUserChanged, onError);
}
