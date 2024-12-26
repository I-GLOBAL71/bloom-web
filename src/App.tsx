import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SplashScreen } from './components/SplashScreen';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { UserDashboard } from './pages/UserDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* SplashScreen route */}
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

      {/* Public routes */}
      <Route 
        path="/home" 
        element={
          currentUser ? <Navigate to="/dashboard/home" replace /> : <HomePage />
        } 
      />
      <Route 
        path="/login" 
        element={
          currentUser ? <Navigate to="/dashboard/home" replace /> : <AuthPage mode="login" />
        } 
      />
      <Route 
        path="/signup" 
        element={
          currentUser ? <Navigate to="/dashboard/home" replace /> : <AuthPage mode="signup" />
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
      
      {/* Dashboard routes */}
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route 
        path="*" 
        element={<Navigate to="/home" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;