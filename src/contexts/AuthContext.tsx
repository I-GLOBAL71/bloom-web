import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Auth,
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
  getAuth
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { logger } from '../utils/logger';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  retry: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    logger.firebase.auth('AuthProvider:init');
    
    // Configure persistence at startup
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        logger.firebase.auth('persistence:set', { type: 'browserLocal' });
      })
      .catch(error => {
        logger.firebase.error('persistence', error);
      });

    // Log current auth state
    const currentAuth = getAuth();
    logger.firebase.auth('currentAuthState', {
      isAuthenticated: !!currentAuth.currentUser,
      userId: currentAuth.currentUser?.uid
    });

    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        logger.firebase.auth('authStateChanged', {
          hasUser: !!user,
          userId: user?.uid,
          email: user?.email
        });
        
        setCurrentUser(user);
        setLoading(false);
        setError(null);
        setRetryCount(0);
      },
      (error) => {
        logger.firebase.error('authStateChanged', error);
        setError(error);
        setLoading(false);

        // Retry logic for network errors
        if (error.code === 'auth/network-request-failed') {
          const timeout = Math.min(1000 * Math.pow(2, retryCount), 10000);
          logger.firebase.auth('retry:scheduled', { timeout, retryCount });
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            retry();
          }, timeout);
        }
      }
    );

    return () => {
      logger.firebase.auth('cleanup');
      unsubscribe();
    };
  }, [retryCount]);

  const retry = useCallback(async () => {
    logger.firebase.auth('retry:start', { retryCount });
    try {
      // Force a re-authentication check
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        logger.firebase.auth('retry:success', { userId: user.uid });
      }
    } catch (error) {
      logger.firebase.error('retry', error);
      throw error;
    }
  }, []);

  const login = useCallback(async () => {
    logger.firebase.auth('login:start');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      logger.firebase.auth('login:success', {
        userId: result.user.uid,
        email: result.user.email
      });
    } catch (error) {
      logger.firebase.error('login', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    logger.firebase.auth('logout:start');
    try {
      await signOut(auth);
      logger.firebase.auth('logout:success');
    } catch (error) {
      logger.firebase.error('logout', error);
      throw error;
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    retry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};