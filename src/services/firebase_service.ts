import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  FarmDetails,
  FavoriteItem,
  IrrigationSchedule,
  UserProfile,
  WaterUsageRecord,
} from '../models/types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without this line as required by the Firebase skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Skill-mandated OperationType and FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Skill-mandated connection test
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network disconnected.');
      return false;
    }
    // Document does not need to exist to verify network reachability
    return true;
  }
}

/**
 * Strips all undefined fields recursively from an object before sending to Firestore,
 * preventing "Function setDoc() called with invalid data. Unsupported field value: undefined" errors.
 */
export function sanitizeForFirestore<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  if (!data || typeof data !== 'object') return data;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      sanitized[key] = sanitizeForFirestore(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// ----------------------------------------------------
// Local Storage / Guest Farmer Fallback Support
// ----------------------------------------------------
const LOCAL_STORAGE_PREFIX = 'agriflow_guest_';

function isGuestUser(userId: string): boolean {
  return userId === 'farmer_local_user' || !auth.currentUser;
}

function getLocalData<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, val: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(val));
    window.dispatchEvent(new Event('agriflow_local_storage_change'));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// ----------------------------------------------------
// 1. Farmer Profile Realtime Service
// ----------------------------------------------------
export function subscribeUserProfile(
  userId: string,
  onUpdate: (profile: UserProfile | null) => void,
  onError?: (err: Error) => void
): () => void {
  if (isGuestUser(userId)) {
    const update = () => {
      onUpdate(getLocalData<UserProfile | null>(`user_${userId}`, null));
    };
    update();
    window.addEventListener('agriflow_local_storage_change', update);
    return () => window.removeEventListener('agriflow_local_storage_change', update);
  }

  const docPath = `users/${userId}`;
  const ref = doc(db, 'users', userId);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserProfile);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, docPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (isGuestUser(profile.userId)) {
    setLocalData(`user_${profile.userId}`, profile);
    return;
  }
  const path = `users/${profile.userId}`;
  try {
    const ref = doc(db, 'users', profile.userId);
    await setDoc(ref, sanitizeForFirestore(profile as unknown as Record<string, unknown>), { merge: true });
  } catch (error) {
    // If permission fails, cache locally
    setLocalData(`user_${profile.userId}`, profile);
  }
}

// ----------------------------------------------------
// 2. Farm Details Realtime Service
// ----------------------------------------------------
export function subscribeFarmDetails(
  userId: string,
  onUpdate: (farm: FarmDetails | null) => void,
  onError?: (err: Error) => void
): () => void {
  if (isGuestUser(userId)) {
    const update = () => {
      onUpdate(getLocalData<FarmDetails | null>(`farm_${userId}`, null));
    };
    update();
    window.addEventListener('agriflow_local_storage_change', update);
    return () => window.removeEventListener('agriflow_local_storage_change', update);
  }

  const docPath = `farms/${userId}`;
  const ref = doc(db, 'farms', userId);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as FarmDetails);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, docPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function saveFarmDetails(farm: FarmDetails): Promise<void> {
  if (isGuestUser(farm.userId)) {
    setLocalData(`farm_${farm.userId}`, farm);
    return;
  }
  const path = `farms/${farm.userId}`;
  try {
    const ref = doc(db, 'farms', farm.userId);
    await setDoc(ref, sanitizeForFirestore(farm as unknown as Record<string, unknown>), { merge: true });
  } catch (error) {
    setLocalData(`farm_${farm.userId}`, farm);
  }
}

// ----------------------------------------------------
// 3. Water Usage Records Realtime Service
// ----------------------------------------------------
export function subscribeWaterRecords(
  userId: string,
  onUpdate: (records: WaterUsageRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (isGuestUser(userId)) {
    const update = () => {
      const records = getLocalData<WaterUsageRecord[]>(`records_${userId}`, []);
      records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(records);
    };
    update();
    window.addEventListener('agriflow_local_storage_change', update);
    return () => window.removeEventListener('agriflow_local_storage_change', update);
  }

  const colPath = `waterUsage/${userId}/records`;
  const ref = collection(db, 'waterUsage', userId, 'records');

  return onSnapshot(
    ref,
    (snapshot) => {
      const records: WaterUsageRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as WaterUsageRecord);
      });
      // Sort newest first
      records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, colPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function addWaterRecord(record: WaterUsageRecord): Promise<void> {
  if (isGuestUser(record.userId)) {
    const existing = getLocalData<WaterUsageRecord[]>(`records_${record.userId}`, []);
    existing.unshift(record);
    setLocalData(`records_${record.userId}`, existing);
    return;
  }
  const path = `waterUsage/${record.userId}/records/${record.id}`;
  try {
    const ref = doc(db, 'waterUsage', record.userId, 'records', record.id);
    await setDoc(ref, sanitizeForFirestore(record as unknown as Record<string, unknown>));
  } catch (error) {
    // If unauthenticated or guest write fails, fall back to local storage
    const existing = getLocalData<WaterUsageRecord[]>(`records_${record.userId}`, []);
    existing.unshift(record);
    setLocalData(`records_${record.userId}`, existing);
  }
}

export async function updateWaterRecord(record: WaterUsageRecord): Promise<void> {
  if (isGuestUser(record.userId)) {
    const existing = getLocalData<WaterUsageRecord[]>(`records_${record.userId}`, []);
    const idx = existing.findIndex((r) => r.id === record.id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...record };
      setLocalData(`records_${record.userId}`, existing);
    }
    return;
  }
  const path = `waterUsage/${record.userId}/records/${record.id}`;
  try {
    const ref = doc(db, 'waterUsage', record.userId, 'records', record.id);
    await updateDoc(ref, sanitizeForFirestore({
      crop: record.crop,
      date: record.date,
      waterUsed: record.waterUsed,
      unit: record.unit,
      irrigationMethod: record.irrigationMethod,
      durationHours: record.durationHours,
      areaCovered: record.areaCovered,
      notes: record.notes,
    } as Record<string, unknown>));
  } catch (error) {
    const existing = getLocalData<WaterUsageRecord[]>(`records_${record.userId}`, []);
    const idx = existing.findIndex((r) => r.id === record.id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...record };
      setLocalData(`records_${record.userId}`, existing);
    }
    console.warn(`Failed to update water record in Firestore (${path}), updated locally:`, error);
  }
}

export async function deleteWaterRecord(userId: string, recordId: string): Promise<void> {
  if (isGuestUser(userId)) {
    const existing = getLocalData<WaterUsageRecord[]>(`records_${userId}`, []);
    const filtered = existing.filter((r) => r.id !== recordId);
    setLocalData(`records_${userId}`, filtered);
    return;
  }
  const path = `waterUsage/${userId}/records/${recordId}`;
  try {
    const ref = doc(db, 'waterUsage', userId, 'records', recordId);
    await deleteDoc(ref);
  } catch (error) {
    const existing = getLocalData<WaterUsageRecord[]>(`records_${userId}`, []);
    const filtered = existing.filter((r) => r.id !== recordId);
    setLocalData(`records_${userId}`, filtered);
    console.warn(`Failed to delete water record in Firestore (${path}), updated locally:`, error);
  }
}

// ----------------------------------------------------
// 4. Saved Favorites / Knowledge Realtime Service
// ----------------------------------------------------
export function subscribeFavorites(
  userId: string,
  onUpdate: (favorites: FavoriteItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (isGuestUser(userId)) {
    const update = () => {
      onUpdate(getLocalData<FavoriteItem[]>(`favorites_${userId}`, []));
    };
    update();
    window.addEventListener('agriflow_local_storage_change', update);
    return () => window.removeEventListener('agriflow_local_storage_change', update);
  }

  const colPath = `favorites/${userId}/items`;
  const ref = collection(db, 'favorites', userId, 'items');

  return onSnapshot(
    ref,
    (snapshot) => {
      const items: FavoriteItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as FavoriteItem);
      });
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, colPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function toggleFavoriteItem(
  userId: string,
  item: { itemId: string; title: string; category: string },
  currentlySaved: boolean
): Promise<void> {
  if (isGuestUser(userId)) {
    let existing = getLocalData<FavoriteItem[]>(`favorites_${userId}`, []);
    if (currentlySaved) {
      existing = existing.filter((f) => f.itemId !== item.itemId);
    } else {
      existing.push({
        itemId: item.itemId,
        userId,
        title: item.title,
        category: item.category,
        savedAt: new Date().toISOString(),
      });
    }
    setLocalData(`favorites_${userId}`, existing);
    return;
  }

  const path = `favorites/${userId}/items/${item.itemId}`;
  try {
    const ref = doc(db, 'favorites', userId, 'items', item.itemId);
    if (currentlySaved) {
      await deleteDoc(ref);
    } else {
      const fav: FavoriteItem = {
        itemId: item.itemId,
        userId,
        title: item.title,
        category: item.category,
        savedAt: new Date().toISOString(),
      };
      await setDoc(ref, sanitizeForFirestore(fav as unknown as Record<string, unknown>));
    }
  } catch (error) {
    let existing = getLocalData<FavoriteItem[]>(`favorites_${userId}`, []);
    if (currentlySaved) {
      existing = existing.filter((f) => f.itemId !== item.itemId);
    } else {
      existing.push({
        itemId: item.itemId,
        userId,
        title: item.title,
        category: item.category,
        savedAt: new Date().toISOString(),
      });
    }
    setLocalData(`favorites_${userId}`, existing);
  }
}

// ----------------------------------------------------
// 5. Irrigation Schedules Realtime Service
// ----------------------------------------------------
export function subscribeSchedules(
  userId: string,
  onUpdate: (schedules: IrrigationSchedule[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (isGuestUser(userId)) {
    const update = () => {
      const items = getLocalData<IrrigationSchedule[]>(`schedules_${userId}`, []);
      items.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
      onUpdate(items);
    };
    update();
    window.addEventListener('agriflow_local_storage_change', update);
    return () => window.removeEventListener('agriflow_local_storage_change', update);
  }

  const colPath = `irrigationSchedules/${userId}/schedules`;
  const ref = collection(db, 'irrigationSchedules', userId, 'schedules');

  return onSnapshot(
    ref,
    (snapshot) => {
      const items: IrrigationSchedule[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as IrrigationSchedule);
      });
      items.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, colPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function addIrrigationSchedule(schedule: IrrigationSchedule): Promise<void> {
  if (isGuestUser(schedule.userId)) {
    const existing = getLocalData<IrrigationSchedule[]>(`schedules_${schedule.userId}`, []);
    existing.push(schedule);
    setLocalData(`schedules_${schedule.userId}`, existing);
    return;
  }

  const path = `irrigationSchedules/${schedule.userId}/schedules/${schedule.id}`;
  try {
    const ref = doc(db, 'irrigationSchedules', schedule.userId, 'schedules', schedule.id);
    await setDoc(ref, sanitizeForFirestore(schedule as unknown as Record<string, unknown>));
  } catch (error) {
    const existing = getLocalData<IrrigationSchedule[]>(`schedules_${schedule.userId}`, []);
    existing.push(schedule);
    setLocalData(`schedules_${schedule.userId}`, existing);
  }
}

export async function updateScheduleStatus(
  userId: string,
  scheduleId: string,
  status: IrrigationSchedule['status'],
  weatherAlert?: string
): Promise<void> {
  if (isGuestUser(userId)) {
    const existing = getLocalData<IrrigationSchedule[]>(`schedules_${userId}`, []);
    const idx = existing.findIndex((s) => s.id === scheduleId);
    if (idx !== -1) {
      existing[idx].status = status;
      if (weatherAlert !== undefined) existing[idx].weatherAlert = weatherAlert;
      setLocalData(`schedules_${userId}`, existing);
    }
    return;
  }

  const path = `irrigationSchedules/${userId}/schedules/${scheduleId}`;
  try {
    const ref = doc(db, 'irrigationSchedules', userId, 'schedules', scheduleId);
    const updatePayload: Record<string, unknown> = { status };
    if (weatherAlert !== undefined) {
      updatePayload.weatherAlert = weatherAlert;
    }
    await updateDoc(ref, sanitizeForFirestore(updatePayload));
  } catch (error) {
    const existing = getLocalData<IrrigationSchedule[]>(`schedules_${userId}`, []);
    const idx = existing.findIndex((s) => s.id === scheduleId);
    if (idx !== -1) {
      existing[idx].status = status;
      if (weatherAlert !== undefined) existing[idx].weatherAlert = weatherAlert;
      setLocalData(`schedules_${userId}`, existing);
    }
    console.warn(`Failed to update schedule in Firestore (${path}), updated locally:`, error);
  }
}

export async function deleteIrrigationSchedule(userId: string, scheduleId: string): Promise<void> {
  if (isGuestUser(userId)) {
    const existing = getLocalData<IrrigationSchedule[]>(`schedules_${userId}`, []);
    const filtered = existing.filter((s) => s.id !== scheduleId);
    setLocalData(`schedules_${userId}`, filtered);
    return;
  }

  const path = `irrigationSchedules/${userId}/schedules/${scheduleId}`;
  try {
    const ref = doc(db, 'irrigationSchedules', userId, 'schedules', scheduleId);
    await deleteDoc(ref);
  } catch (error) {
    const existing = getLocalData<IrrigationSchedule[]>(`schedules_${userId}`, []);
    const filtered = existing.filter((s) => s.id !== scheduleId);
    setLocalData(`schedules_${userId}`, filtered);
    console.warn(`Failed to delete schedule in Firestore (${path}), updated locally:`, error);
  }
}

// ----------------------------------------------------
// 6. Farmer Questions / Help Realtime Service
// ----------------------------------------------------
export function subscribeFarmerQuestions(
  userId: string,
  onUpdate: (questions: import('../models/types').FarmerQuestion[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (isGuestUser(userId)) {
    const update = () => {
      const items = getLocalData<import('../models/types').FarmerQuestion[]>(`questions_${userId}`, []);
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items);
    };
    update();
    window.addEventListener('agriflow_local_storage_change', update);
    return () => window.removeEventListener('agriflow_local_storage_change', update);
  }

  const colPath = `farmerQuestions/${userId}/questions`;
  const ref = collection(db, 'farmerQuestions', userId, 'questions');

  return onSnapshot(
    ref,
    (snapshot) => {
      const items: import('../models/types').FarmerQuestion[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as import('../models/types').FarmerQuestion);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, colPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function addFarmerQuestion(question: import('../models/types').FarmerQuestion): Promise<void> {
  if (isGuestUser(question.userId)) {
    const existing = getLocalData<import('../models/types').FarmerQuestion[]>(`questions_${question.userId}`, []);
    existing.unshift(question);
    setLocalData(`questions_${question.userId}`, existing);
    return;
  }

  const path = `farmerQuestions/${question.userId}/questions/${question.id}`;
  try {
    const ref = doc(db, 'farmerQuestions', question.userId, 'questions', question.id);
    await setDoc(ref, sanitizeForFirestore(question as unknown as Record<string, unknown>));
  } catch (error) {
    const existing = getLocalData<import('../models/types').FarmerQuestion[]>(`questions_${question.userId}`, []);
    existing.unshift(question);
    setLocalData(`questions_${question.userId}`, existing);
  }
}

export async function deleteFarmerQuestion(userId: string, questionId: string): Promise<void> {
  if (isGuestUser(userId)) {
    const existing = getLocalData<import('../models/types').FarmerQuestion[]>(`questions_${userId}`, []);
    const filtered = existing.filter((q) => q.id !== questionId);
    setLocalData(`questions_${userId}`, filtered);
    return;
  }

  const path = `farmerQuestions/${userId}/questions/${questionId}`;
  try {
    const ref = doc(db, 'farmerQuestions', userId, 'questions', questionId);
    await deleteDoc(ref);
  } catch (error) {
    const existing = getLocalData<import('../models/types').FarmerQuestion[]>(`questions_${userId}`, []);
    const filtered = existing.filter((q) => q.id !== questionId);
    setLocalData(`questions_${userId}`, filtered);
    console.warn(`Failed to delete question in Firestore (${path}), updated locally:`, error);
  }
}

// ----------------------------------------------------
// 7. AgriFlow Farmer Assistant Chat Realtime Service
// ----------------------------------------------------
export function subscribeChatMessages(
  userId: string,
  sessionId: string,
  onUpdate: (messages: import('../models/types').ChatMessage[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (isGuestUser(userId)) {
    const update = () => {
      const items = getLocalData<import('../models/types').ChatMessage[]>(`chat_${sessionId}`, []);
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items);
    };
    update();
    window.addEventListener('agriflow_local_storage_change', update);
    return () => window.removeEventListener('agriflow_local_storage_change', update);
  }

  const colPath = `chatSessions/${userId}/sessions/${sessionId}/messages`;
  const ref = collection(db, 'chatSessions', userId, 'sessions', sessionId, 'messages');

  return onSnapshot(
    ref,
    (snapshot) => {
      const items: import('../models/types').ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as import('../models/types').ChatMessage);
      });
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, colPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

export async function saveChatMessage(
  userId: string,
  sessionId: string,
  message: import('../models/types').ChatMessage
): Promise<void> {
  if (isGuestUser(userId)) {
    const existing = getLocalData<import('../models/types').ChatMessage[]>(`chat_${sessionId}`, []);
    existing.push(message);
    setLocalData(`chat_${sessionId}`, existing);
    return;
  }

  const sessionPath = `chatSessions/${userId}/sessions/${sessionId}`;
  const messagePath = `chatSessions/${userId}/sessions/${sessionId}/messages/${message.id}`;
  try {
    // 1. Ensure parent session document exists
    const sessionRef = doc(db, 'chatSessions', userId, 'sessions', sessionId);
    await setDoc(
      sessionRef,
      sanitizeForFirestore({
        id: sessionId,
        userId,
        lastMessage: message.content.slice(0, 100),
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );

    // 2. Save individual message
    const msgRef = doc(db, 'chatSessions', userId, 'sessions', sessionId, 'messages', message.id);
    await setDoc(msgRef, sanitizeForFirestore(message as unknown as Record<string, unknown>));
  } catch (error) {
    const existing = getLocalData<import('../models/types').ChatMessage[]>(`chat_${sessionId}`, []);
    existing.push(message);
    setLocalData(`chat_${sessionId}`, existing);
  }
}

export async function clearChatSession(userId: string, sessionId: string): Promise<void> {
  if (isGuestUser(userId)) {
    setLocalData(`chat_${sessionId}`, []);
    return;
  }

  const path = `chatSessions/${userId}/sessions/${sessionId}`;
  try {
    const sessionRef = doc(db, 'chatSessions', userId, 'sessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    setLocalData(`chat_${sessionId}`, []);
    console.warn(`Failed to clear chat session in Firestore (${path}), cleared locally:`, error);
  }
}
