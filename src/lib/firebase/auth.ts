import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  signInWithCredential,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { AuthError, FirebaseUserExtended, AuthUser } from '../../types/auth';

// Configuration du provider Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline'
});

// Utilitaire pour formater les erreurs Firebase
const formatAuthError = (error: any): AuthError => {
  console.error('[Auth] Error:', error);
  
  const formattedError: AuthError = new Error(
    error.message || 'Une erreur est survenue lors de l\'authentification'
  );
  formattedError.code = error.code;
  
  return formattedError;
};

// Convertir Timestamp Firestore en Date
const convertTimestamp = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Créer ou mettre à jour l'utilisateur dans Firestore
export const createOrUpdateUser = async (user: User): Promise<AuthUser> => {
  try {
console.log('[Auth] Creating/Updating user with data:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    });

    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    
    const now = serverTimestamp();
    
   interface FirestoreUserData {
     id: string;
     email: string | null;
     name: string;
     displayName: string | null;
     phoneNumber: string | null;
     photoURL: string | null;
     updatedAt: any; // Pour accepter à la fois FieldValue et Timestamp
     hasCompletedOnboarding: boolean;
     createdAt?: any;
   }

   let userData: FirestoreUserData = {
     id: user.uid,
     email: user.email || '',
     name: user.displayName || user.email?.split('@')[0] || 'User',
     displayName: user.displayName,
     phoneNumber: user.phoneNumber || '',
     photoURL: user.photoURL || '',
     updatedAt: now,
     hasCompletedOnboarding: false
   };

   // Si l'utilisateur existe, préserver les données existantes
   if (userSnapshot.exists()) {
     const existingData = userSnapshot.data() as AuthUser;
     userData = {
       ...existingData,
       ...userData,
       hasCompletedOnboarding: existingData.hasCompletedOnboarding
     };
   }

    console.log('[Auth] User data to save:', userData);

    if (!userSnapshot.exists()) {
      console.log('[Auth] New user - creating document');
      // Nouveau utilisateur
      await setDoc(userRef, {
        ...userData,
        createdAt: now
      });
    } else {
      console.log('[Auth] Existing user - updating document');
      // Mise à jour utilisateur existant
      const existingData = userSnapshot.data();
      console.log('[Auth] Existing user data:', existingData);
      await setDoc(userRef, userData, { merge: true });
    }

    const updatedSnapshot = await getDoc(userRef);
    const updatedData = updatedSnapshot.data();
    
    console.log('[Auth] Final user data:', updatedData);

    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || 'User',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      phoneNumber: user.phoneNumber || '',
      photoURL: user.photoURL || '',
      hasCompletedOnboarding: updatedData?.hasCompletedOnboarding ?? false,
      createdAt: updatedData?.createdAt ? convertTimestamp(updatedData.createdAt) : new Date(),
      updatedAt: updatedData?.updatedAt ? convertTimestamp(updatedData.updatedAt) : new Date()
    };
  } catch (error) {
    console.error('[Auth] Error creating/updating user:', error);
    throw formatAuthError(error);
  }
};

// Authentification Google avec popup
export const signInWithGoogle = async (): Promise<void> => {
  try {
    console.log('[Auth] Starting Google sign in with popup');
    
    // Configurer le provider avec les scopes nécessaires
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Lancer le popup
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[Auth] Google sign in successful:', {
      providerId: result.providerId,
      uid: result.user.uid
    });
    
    // Créer ou mettre à jour l'utilisateur immédiatement
    await createOrUpdateUser(result.user);
  } catch (error) {
    console.error('[Auth] Google sign in error:', error);
    throw formatAuthError(error);
  }
};

// Authentification par email (lien magique)
export const signInWithEmail = async (email: string): Promise<void> => {
  try {
    const actionCodeSettings = {
      url: window.location.origin + '/auth/email-signin',
      handleCodeInApp: true
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
  } catch (error) {
    throw formatAuthError(error);
  }
};

// Vérification du lien magique
export const completeEmailSignIn = async (email: string, link: string): Promise<User> => {
  try {
    if (!isSignInWithEmailLink(auth, link)) {
      throw new Error('Lien de connexion invalide');
    }

    const result = await signInWithEmailLink(auth, email, link);
    localStorage.removeItem('emailForSignIn');
    return result.user;
  } catch (error) {
    throw formatAuthError(error);
  }
};

// Configuration du reCAPTCHA pour l'authentification par téléphone
let recaptchaVerifier: RecaptchaVerifier | null = null;

const setupRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        recaptchaVerifier = null;
      }
    });
  }
  return recaptchaVerifier;
};

// Authentification par téléphone
export const signInWithPhone = async (phoneNumber: string): Promise<string> => {
  try {
    const verifier = setupRecaptcha();
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return confirmationResult.verificationId;
  } catch (error) {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    throw formatAuthError(error);
  }
};

// Vérification du code SMS
export const verifyPhoneCode = async (code: string, verificationId: string): Promise<User> => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error) {
    throw formatAuthError(error);
  }
};

// Déconnexion
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('emailForSignIn');
    sessionStorage.removeItem('auth_redirect_started');
    sessionStorage.removeItem('auth_redirect_time');
  } catch (error) {
    throw formatAuthError(error);
  }
};

// Vérification du rôle utilisateur
export const getUserRole = async (email: string): Promise<{ role: string } | null> => {
  try {
    if (!email) return null;
    
    const usersRef = doc(db, 'users', email);
    const userDoc = await getDoc(usersRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    return { role: userData.role || 'user' };
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export { auth };
