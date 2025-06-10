import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  console.log('[AuthPage] Auth state:', {
    isAuthenticated,
    user,
    hasCompletedOnboarding: user?.hasCompletedOnboarding
  });

  if (isAuthenticated && user) {
    if (!user.hasCompletedOnboarding) {
      console.log('[AuthPage] Redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    } else {
      console.log('[AuthPage] Redirecting to dashboard');
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute right-0 top-0 h-full w-1/2 transform translate-x-1/3 text-blue-50"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>
      </div>

      {/* Animated circles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Bienvenue sur Bloom
            </h1>
            <p className="text-lg text-gray-600">
              Connectez-vous pour accéder à votre espace personnel et profiter de tous nos services.
            </p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;