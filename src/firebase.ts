import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where, getDocs, getDocFromServer, addDoc, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore as recommended
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Enable persistence for better resilience in fluctuating environments
enableMultiTabIndexedDbPersistence(db).catch(() => {
  // Persistence might fail in some environments (private browsing, multiple tabs), fallback is silent
});

export const auth = getAuth(app);

// Error handling for Firestore operations as per guidelines
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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore
async function testConnection() {
  // Give the app a moment to stabilize before testing connection
  setTimeout(async () => {
    try {
      await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    } catch (error) {
      // Only log if it's a genuine connection issue after the grace period
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn("Firestore is currently in offline mode. This is often temporary while establishing a connection.");
      }
    }
  }, 2000);
}
testConnection();

export { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc
};
export type { User };
