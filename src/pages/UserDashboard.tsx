import React, { useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from '../components/ErrorBoundary';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { logger } from '../utils/logger';
import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout';

// Import des sections optimisées avec React.lazy
const SwipeSection = React.lazy(() => import('../components/dashboard/features/SwipeSection').then(m => ({ default: m.SwipeSection })));
const HomeSection = React.lazy(() => import('../components/dashboard/sections/HomeSection').then(m => ({ default: m.default })));
const MatchesSection = React.lazy(() => import('../components/dashboard/sections/MatchesSection').then(m => ({ default: m.MatchesSection })));
const MessagesSection = React.lazy(() => import('../components/dashboard/sections/MessagesSection').then(m => ({ default: m.MessagesSection })));
const ProfileSection = React.lazy(() => import('../components/dashboard/sections/ProfileSection').then(m => ({ default: m.default })));
const PremiumSection = React.lazy(() => import('../components/dashboard/sections/PremiumSection').then(m => ({ default: m.PremiumSection })));
const SettingsSection = React.lazy(() => import('../components/dashboard/sections/SettingsSection').then(m => ({ default: m.SettingsSection })));
const CreditsSection = React.lazy(() => import('../components/dashboard/sections/CreditsSection').then(m => ({ default: m.CreditsSection })));

export function UserDashboard() {
  const { isAuthenticated } = useAuth();
  const { profile, loading } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation handler with path validation
  const navigateTo = useCallback((path: string) => {
    // Normalize path - remove duplicate slashes and trailing slashes
    const normalizedPath = path.replace(/\/+/g, '/').replace(/\/$/, '');
    
    // Only navigate if the path is different from current location
    if (normalizedPath !== location.pathname.replace(/\/+/g, '/').replace(/\/$/, '')) {
      navigate(normalizedPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  // Debounced navigation with cleanup
  const debouncedNavigate = useMemo(
    () => debounce(navigateTo, 100),
    [navigateTo]
  );

  // State tracking for logging
  const prevState = useRef({
    isAuthenticated,
    hasProfile: !!profile,
    currentPath: location.pathname
  });

  useEffect(() => {
    const currentState = {
      isAuthenticated,
      hasProfile: !!profile,
      currentPath: location.pathname
    };

    // Only log if state has meaningfully changed
    if (JSON.stringify(currentState) !== JSON.stringify(prevState.current)) {
      logger.info('[UserDashboard] Component Updated', JSON.stringify(currentState));
      prevState.current = currentState;
    }

    // Log route changes
    logger.debug('[UserDashboard] Route changed', JSON.stringify({
      path: location.pathname,
      state: location.state,
      key: location.key
    }, null, 2));
  }, [isAuthenticated, profile, location]);

  // Log initial mount
  useEffect(() => {
    logger.debug('[UserDashboard] Component mounted', JSON.stringify({
      isAuthenticated,
      hasProfile: !!profile,
      initialPath: location.pathname
    }, null, 2));
  }, []);

  // Handle authentication and profile redirects
  useEffect(() => {
    if (!loading) {
      // Normalize current path
      const currentPath = location.pathname.replace(/\/+/g, '/').replace(/\/$/, '');
      
      if (!isAuthenticated && !currentPath.startsWith('/login')) {
        debouncedNavigate('/login');
      } else if (isAuthenticated && !profile && !currentPath.startsWith('/complete-profile')) {
        debouncedNavigate('/complete-profile');
      }
    }
  }, [loading, isAuthenticated, profile, debouncedNavigate, location.pathname]);

  // Clean up du debounce
  useEffect(() => {
    return () => {
      debouncedNavigate.cancel();
    };
  }, [debouncedNavigate]);

  // Loading state mémorisé
  const loadingComponent = useMemo(() => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  ), []);

  if (loading) {
    return loadingComponent;
  }

  // Early return si non authentifié ou pas de profil
  if (!isAuthenticated || (!profile && !loading)) {
    return null; // La redirection est gérée par l'useEffect
  }


  return (
    <DashboardLayout>
      <Suspense fallback={loadingComponent}>
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<SwipeSection />} />
          <Route path="/home" element={<HomeSection />} />
          <Route path="/matches" element={<MatchesSection />} />
          <Route path="/home/messages/*" element={<MessagesSection />}>
            <Route path="matches" element={<MatchesSection />} />
            <Route path="matches/home" element={<HomeSection />} />
            <Route path="matches/home/profile" element={<ProfileSection />} />
          </Route>
          <Route path="/profile" element={<ProfileSection />} />
          <Route path="/premium" element={<PremiumSection />} />
          <Route path="/settings" element={<SettingsSection />} />
          <Route path="/credits" element={<CreditsSection />} />
          <Route 
            path="/*"
            element={<Navigate to="/" replace />}
          />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </DashboardLayout>
  );
}

// Exporter une version mémorisée du composant
export default React.memo(UserDashboard);
