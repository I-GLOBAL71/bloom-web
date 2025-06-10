import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthError, AuthMethod } from '../../types/auth';
import { Mail, Phone } from 'lucide-react';
import { AuthForm } from './AuthForm';
import { useNavigate } from 'react-router-dom';

export const AuthButtons = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const {
    isLoading,
    signInWithGoogle,
    user,
    isAuthenticated
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.hasCompletedOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleEmailAuth = () => {
    setAuthMethod('email');
    setShowForm(true);
  };

  const handlePhoneAuth = () => {
    setAuthMethod('phone');
    setShowForm(true);
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('[AuthButtons] Starting Google auth...');
      await signInWithGoogle();
    } catch (error) {
      console.error('[AuthButtons] Google auth error:', (error as AuthError).message);
    }
  };

  useEffect(() => {
    console.log('[AuthButtons] Auth state:', {
      isAuthenticated,
      user,
      hasCompletedOnboarding: user?.hasCompletedOnboarding
    });

    if (isAuthenticated && user) {
      console.log('[AuthButtons] User authenticated:', {
        userId: user.id,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      });

      if (!user.hasCompletedOnboarding) {
        console.log('[AuthButtons] Redirecting to onboarding...');
        navigate('/onboarding');
      } else {
        console.log('[AuthButtons] Redirecting to dashboard...');
        navigate('/app/dashboard');
      }
    }
  }, [isAuthenticated, navigate, user]);

  const baseButtonClasses = "w-full px-6 py-3.5 text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center gap-2";

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
      {/* Email section */}
      <div className="space-y-4">
        <button
          onClick={handleEmailAuth}
          disabled={isLoading}
          className={`${baseButtonClasses} bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600`}
        >
          <Mail className="w-5 h-5" />
          Commencer avec l'email
        </button>

        {showForm && authMethod === 'email' && (
          <div className="py-4">
            <AuthForm initialMethod="email" />
          </div>
        )}
      </div>

      {/* Phone section */}
      <div className="space-y-4">
        <button
          onClick={handlePhoneAuth}
          disabled={isLoading}
          className={`${baseButtonClasses} bg-white text-gray-700 border border-gray-200 hover:bg-gray-50`}
        >
          <Phone className="w-5 h-5" />
          Continuer avec le téléphone
        </button>

        {showForm && authMethod === 'phone' && (
          <div className="py-4">
            <AuthForm initialMethod="phone" />
          </div>
        )}
      </div>
      
      {/* Google button */}
      <button
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className={`${baseButtonClasses} bg-gradient-to-r from-amber-400 to-rose-400 text-white hover:from-amber-500 hover:to-rose-500`}
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Google
      </button>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-rose-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};