import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthMethod } from '../types/auth';

export const useAuthMethods = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [initialMethod, setInitialMethod] = useState<AuthMethod>('email');
  const { isAuthenticated } = useAuth();

  const openAuthWithMethod = (method: AuthMethod) => {
    setInitialMethod(method);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  return {
    isAuthOpen,
    initialMethod,
    openAuthWithMethod,
    closeAuth,
    isAuthenticated
  };
};