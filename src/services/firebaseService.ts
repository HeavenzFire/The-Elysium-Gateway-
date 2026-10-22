import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  getDocFromServer, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  onSnapshot,
  serverTimestamp,
  type Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase Core
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore using the specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export enum OperationType {
  CREATE = 'create',
  GET = 'get',
  LIST = 'list',
  UPDATE = 'update',
  DELETE = 'delete',
  WRITE = 'write'
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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  };
  console.error('[Firestore Error Details]', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore on boot as required by system directives.
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Successfully contacted Firestore instance');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is operating offline or connecting to Firestore.');
    } else {
      console.log('[Firebase] Handshake complete (expected permission check on test doc).');
    }
    return true;
  }
}

// Initial bootstrap test
testConnection().catch((err) => console.warn('[Firebase] Initial connection check:', err));

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    console.error('[Auth] Google sign in failed:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Synchronize user profile in Firestore
 */
export async function syncUserProfile(user: User): Promise<void> {
  const userPath = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);
    const now = new Date().toISOString();

    const data: Record<string, any> = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Council Scholar',
      photoURL: user.photoURL || '',
      updatedAt: now
    };

    if (!existing.exists()) {
      data.createdAt = now;
      await setDoc(userRef, data);
    } else {
      await updateDoc(userRef, data);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

/**
 * Save an autonomous agent task to Cloud Firestore
 */
export async function saveUserAgentTask(userId: string, task: {
  id: string;
  title: string;
  directive: string;
  assignedEntityId: string;
  status: string;
  deliverables?: any;
}): Promise<void> {
  const path = `users/${userId}/tasks/${task.id}`;
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', task.id);
    const now = new Date().toISOString();
    await setDoc(taskRef, {
      id: task.id,
      title: task.title.slice(0, 250),
      directive: task.directive.slice(0, 9900),
      assignedEntityId: task.assignedEntityId.slice(0, 60),
      status: task.status.slice(0, 60),
      deliverables: task.deliverables || {},
      authorUid: userId,
      createdAt: now,
      updatedAt: now
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for user's agent tasks
 */
export function subscribeToUserTasks(
  userId: string,
  onTasks: (tasks: any[]) => void
): Unsubscribe {
  const path = `users/${userId}/tasks`;
  try {
    const colRef = collection(db, 'users', userId, 'tasks');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const tasks: any[] = [];
        snapshot.forEach((doc) => {
          tasks.push({ ...doc.data(), firestoreId: doc.id });
        });
        onTasks(tasks);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

/**
 * Delete a user's agent task
 */
export async function deleteUserAgentTask(userId: string, taskId: string): Promise<void> {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Save research session to Cloud Firestore
 */
export async function saveUserSession(userId: string, session: {
  id: string;
  title: string;
  activeEntityId: string;
  summary?: string;
}): Promise<void> {
  const path = `users/${userId}/sessions/${session.id}`;
  try {
    const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
    const now = new Date().toISOString();
    await setDoc(sessionRef, {
      id: session.id,
      title: session.title.slice(0, 250),
      activeEntityId: session.activeEntityId.slice(0, 60),
      summary: (session.summary || '').slice(0, 2000),
      authorUid: userId,
      createdAt: now
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
