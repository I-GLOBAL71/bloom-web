import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialiser Firebase
console.log('[Firebase] Initializing app');
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Configuration de l'authentification
console.log('[Firebase] Configuring auth');
export const auth = getAuth(app);

// Configurer la persistence locale par défaut
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('[Firebase] Local persistence configured'))
  .catch(error => console.error('[Firebase] Persistence error:', error));

// Configuration de la langue du dispositif
auth.useDeviceLanguage();

// Configuration des autres services
console.log('[Firebase] Initializing other services');
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configuration des émulateurs en développement
if (import.meta.env.DEV) {
  try {
    const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
    
    if (useEmulators) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('[Firebase] Using emulators');
    }
  } catch (error) {
    console.warn('[Firebase] Error setting up emulators:', error);
  }
}

console.log('[Firebase] Configuration completed');

export default { app, auth, db, storage, analytics };
