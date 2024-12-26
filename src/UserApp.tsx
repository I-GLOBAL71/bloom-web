import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import { AuthProvider } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { UserDashboard } from './pages/UserDashboard';
import { useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import SplashScreen from './components/SplashScreen';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();
  
  // Show loading spinner while checking auth and profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }
  
  // If no user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special handling for onboarding
  const isOnboardingRoute = location.pathname === '/onboarding';
  
  // If on onboarding page and has profile, redirect to dashboard
  if (isOnboardingRoute && profile) {
    return <Navigate to="/dashboard/home" replace />;
  }
  
  // If not on onboarding and no profile, redirect to onboarding
  if (!isOnboardingRoute && !profile) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Render children if all checks pass
  return <>{children}</>;
};

// Lazy load components
const HeroSection = React.lazy(() => import('./components/home/HeroSection').then(module => ({ default: module.HeroSection })));
const FeaturesSection = React.lazy(() => import('./components/home/FeaturesSection').then(module => ({ default: module.FeaturesSection })));
const TestimonialsSection = React.lazy(() => import('./components/home/TestimonialsSection').then(module => ({ default: module.TestimonialsSection })));
const StatsSection = React.lazy(() => import('./components/home/StatsSection').then(module => ({ default: module.StatsSection })));
const SignupSection = React.lazy(() => import('./components/home/SignupSection').then(module => ({ default: module.SignupSection })));

const HomePage = () => (
  <>
    <Header />
    <main className="pt-16">
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Chargement...</div>}>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <StatsSection />
        <SignupSection />
      </Suspense>
    </main>
  </>
);

// Separate the routes into their own component
function AppRoutes() {
  const { currentUser } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/home" 
          element={
            currentUser && profile ? 
              <Navigate to="/dashboard/home" replace /> : 
              <HomePage />
          } 
        />
        <Route 
          path="/login" 
          element={
            currentUser && profile ? 
              <Navigate to="/dashboard/home" replace /> : 
              <AuthPage mode="login" />
          } 
        />
        <Route 
          path="/signup" 
          element={
            currentUser && profile ? 
              <Navigate to="/dashboard/home" replace /> : 
              <AuthPage mode="signup" />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Splash screen */}
        <Route 
          path="/splash" 
          element={
            <Suspense fallback={
              <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#FF8BA7] to-[#FFC6C7]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              </div>
            }>
              <SplashScreen />
            </Suspense>
          } 
        />
        
        {/* Default routes */}
        <Route 
          path="/" 
          element={
            <Navigate 
              to={currentUser ? (profile ? "/dashboard/home" : "/onboarding") : "/home"} 
              replace 
            />
          } 
        />
        <Route 
          path="*" 
          element={
            <Navigate 
              to={currentUser ? (profile ? "/dashboard/home" : "/onboarding") : "/home"} 
              replace 
            />
          } 
        />
      </Routes>
    </div>
  );
}

// Main UserApp component wrapped with AuthProvider
function UserApp() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default UserApp;
