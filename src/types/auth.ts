import type { User as FirebaseUser } from 'firebase/auth';

export interface AuthError extends Error {
  code?: string;
}

export interface SignInState {
  isLoading: boolean;
  error: AuthError | null;
  verificationId?: string;
  confirmationResult?: any;
}

export interface AuthContextState {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

export interface AuthMethods {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<string>;
  verifyPhoneCode: (code: string, verificationId: string) => Promise<void>;
  completeEmailSignIn: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => Promise<void>;
}

export type AuthState = AuthContextState & AuthMethods;

export interface FirebaseUserExtended extends FirebaseUser {
  hasCompletedOnboarding?: boolean;
}

export type AuthMethod = 'google' | 'email' | 'phone';

export interface AuthStep {
  method: AuthMethod;
  status: 'pending' | 'verification' | 'completed' | 'error';
  verificationId?: string;
  error?: AuthError;
}

// Type de base pour un utilisateur authentifié
export interface BaseUser {
  id: string;
  email: string | null;
  name: string;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  hasCompletedOnboarding: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  petals?: number;
  flowers?: number;
}

// Type pour l'authentification
export type AuthUser = BaseUser;

// Type complet pour un utilisateur avec profil
export interface UserProfile extends BaseUser {
  bio?: string;
  interests: string[];
  photos: string[];
  location: {
    city: string;
    country: string;
  };
  profession: string;
}

// Type général pour un utilisateur
export type User = UserProfile;