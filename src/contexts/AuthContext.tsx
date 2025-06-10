import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { type User as FirebaseUser, getRedirectResult } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import {
  signInWithGoogle,
  signInWithEmail,
  signInWithPhone,
  verifyPhoneCode,
  completeEmailSignIn,
  createOrUpdateUser,
  signOut
} from '../lib/firebase/auth';
import type { AuthState, AuthUser, AuthError, AuthStep } from '../types/auth';
import type { User } from 'firebase/auth';

const AuthContext = createContext<AuthState | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // État utilisateur
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep | null>(null);

  // Références pour gérer le cycle de vie et l'initialisation
  const isInitializedRef = useRef<boolean>(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Gestionnaire des changements d'état d'authentification
  useEffect(() => {
    let isSubscribed = true;

    const setupAuthListener = () => {
      // Si déjà initialisé ou démonté, ne rien faire
      if (!isSubscribed || isInitializedRef.current) return;

      console.log('[AuthContext] Setting up auth state listener');

      try {

        // Configurer l'écouteur d'authentification
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (!isSubscribed) return;

          console.log('[AuthContext] Auth state changed:', {
            hasUser: !!firebaseUser,
            uid: firebaseUser?.uid
          });

          try {
            if (firebaseUser) {
              const userData = await createOrUpdateUser(firebaseUser);
              if (isSubscribed) {
                setUser(userData);
                setError(null);
              }
            } else {
              if (isSubscribed) {
                setUser(null);
                setAuthStep(null);
              }
            }
          } catch (err) {
            console.error('[AuthContext] Error processing auth state:', err);
            if (isSubscribed) {
              setError(err as AuthError);
              setUser(null);
            }
          } finally {
            if (isSubscribed) {
              setIsLoading(false);
            }
          }
        });

        // Sauvegarder la fonction de désabonnement
        unsubscribeRef.current = unsubscribe;
        isInitializedRef.current = true;

      } catch (error) {
        console.error('[AuthContext] Auth setup error:', error);
        if (isSubscribed) {
          setError(error as AuthError);
          setIsLoading(false);
        }
      }
    };

    // Démarrer l'initialisation
    setupAuthListener();
    
    // Fonction pour mettre à jour l'utilisateur
    const updateUser = async (firebaseUser: FirebaseUser | null) => {
      if (!isSubscribed) return;

      try {
        if (firebaseUser) {
          const userData = await createOrUpdateUser(firebaseUser);
          if (isSubscribed) {
            setUser(userData);
            setError(null);
          }
        } else {
          if (isSubscribed) {
            setUser(null);
            setAuthStep(null);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Error processing auth state:', err);
        if (isSubscribed) {
          setError(err as AuthError);
          setUser(null);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    // Vérifier le résultat de la redirection Google
    const checkRedirectResult = async () => {
      if (!isSubscribed) return;

      try {
        console.log('[AuthContext] Checking redirect result...');
        const result = await getRedirectResult(auth);
        if (result && isSubscribed) {
          console.log('[AuthContext] Redirect result received:', {
            provider: result.providerId,
            uid: result.user.uid
          });
          await updateUser(result.user);
        }
      } catch (error) {
        console.error('[AuthContext] Redirect result error:', error);
        if (isSubscribed) {
          setError(error as AuthError);
        }
      }
    };

    // Nettoyer les variables de session au démarrage
    if (isSubscribed) {
      sessionStorage.removeItem('auth_redirect_started');
      sessionStorage.removeItem('auth_redirect_time');
    }

    // Vérifier d'abord le résultat de la redirection
    checkRedirectResult();

    // Puis configurer l'écouteur d'état d'authentification
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (!isSubscribed) return;
      console.log('[AuthContext] Auth state changed:', {
        hasUser: !!firebaseUser,
        uid: firebaseUser?.uid,
        isRedirect: sessionStorage.getItem('auth_redirect_started') === 'true'
      });
      
      if (!isSubscribed) return;
      try {
        if (isSubscribed) setIsLoading(true);
        if (isSubscribed) setError(null);

        if (firebaseUser) {
          console.log('[AuthContext] Processing authenticated user');
          const userData = await createOrUpdateUser(firebaseUser);
          if (!isSubscribed) return;
          console.log('[AuthContext] User data processed:', {
            uid: userData.id,
            hasCompletedOnboarding: userData.hasCompletedOnboarding
          });
          if (isSubscribed) setUser(userData);
        } else {
          console.log('[AuthContext] User signed out');
          if (isSubscribed) {
            setUser(null);
            setAuthStep(null);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Error processing auth state:', err);
        if (isSubscribed) {
          setError(err as AuthError);
          setUser(null);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
          console.log('[AuthContext] Auth state processing completed');
        }
      }
    });

    // Nettoyer lors du démontage
    return () => {
      console.log('[AuthContext] Cleaning up auth state listener');
      isSubscribed = false;
      isInitializedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  // Gestionnaire d'authentification Google
  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      console.log('[AuthContext] Starting Google sign in');
      setIsLoading(true);
      setError(null);
      setAuthStep({ method: 'google', status: 'pending' });
      await signInWithGoogle();
      console.log('[AuthContext] Google sign in initiated');
    } catch (err) {
      console.error('[AuthContext] Google sign in error:', err);
      setError(err as AuthError);
      setAuthStep({ method: 'google', status: 'error', error: err as AuthError });
    }
  };

  // Gestionnaire d'authentification par email
  const handleEmailSignIn = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setAuthStep({ method: 'email', status: 'pending' });
      await signInWithEmail(email);
      setAuthStep({ method: 'email', status: 'verification' });
    } catch (err) {
      console.error('[AuthContext] Email sign in error:', err);
      setError(err as AuthError);
      setAuthStep({ method: 'email', status: 'error', error: err as AuthError });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire de vérification email
  const handleEmailVerification = async (email: string, code: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await completeEmailSignIn(email, code);
      setAuthStep({ method: 'email', status: 'completed' });
    } catch (err) {
      console.error('[AuthContext] Email verification error:', err);
      setError(err as AuthError);
      setAuthStep({ method: 'email', status: 'error', error: err as AuthError });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire d'authentification par téléphone
  const handlePhoneSignIn = async (phoneNumber: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      setAuthStep({ method: 'phone', status: 'pending' });
      const verificationId = await signInWithPhone(phoneNumber);
      setAuthStep({ 
        method: 'phone', 
        status: 'verification', 
        verificationId 
      });
      return verificationId;
    } catch (err) {
      console.error('[AuthContext] Phone sign in error:', err);
      setError(err as AuthError);
      setAuthStep({ method: 'phone', status: 'error', error: err as AuthError });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire de vérification du code SMS
  const handlePhoneVerification = async (code: string, verificationId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await verifyPhoneCode(code, verificationId);
      setAuthStep({ method: 'phone', status: 'completed' });
    } catch (err) {
      console.error('[AuthContext] Phone verification error:', err);
      setError(err as AuthError);
      setAuthStep({ method: 'phone', status: 'error', error: err as AuthError });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire de déconnexion
  const handleSignOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut();
      setUser(null);
      setAuthStep(null);
    } catch (err) {
      console.error('[AuthContext] Sign out error:', err);
      setError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentUser = async (userData: Partial<AuthUser>) => {
    if (!user) return;
    try {
      setIsLoading(true);
      // Mettre à jour l'utilisateur avec les nouvelles données
      const updatedUser = await createOrUpdateUser({
        uid: user.id,
        email: user.email,
        displayName: userData.name || user.name,
        phoneNumber: userData.phoneNumber || user.phoneNumber,
        photoURL: userData.photoURL || user.photoURL
      } as FirebaseUser);
      setUser(updatedUser);
    } catch (err) {
      console.error('[AuthContext] Error updating user:', err);
      setError(err as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthState = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle: handleGoogleSignIn,
    signInWithEmail: handleEmailSignIn,
    signInWithPhone: handlePhoneSignIn,
    verifyPhoneCode: handlePhoneVerification,
    completeEmailSignIn: handleEmailVerification,
    signOut: handleSignOut,
    updateUser: updateCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
