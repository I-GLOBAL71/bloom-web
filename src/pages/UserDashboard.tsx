import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { logger } from '../utils/logger';
import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout';
import { HomeSection } from '../components/dashboard/sections/HomeSection';
import { MatchesSection } from '../components/dashboard/sections/MatchesSection';
import { MessagesSection } from '../components/dashboard/sections/MessagesSection';
import { ProfileSection } from '../components/dashboard/sections/ProfileSection';
import { PremiumSection } from '../components/dashboard/sections/PremiumSection';
import { SettingsSection } from '../components/dashboard/sections/SettingsSection';

export function UserDashboard() {
  const { isAuthenticated } = useAuth();
  const { profile, loading } = useProfile();

  useEffect(() => {
    logger.info('[UserDashboard] Component mounted', { isAuthenticated, hasProfile: !!profile });
    
    if (!loading && isAuthenticated) {
      logger.info('[UserDashboard] Loading profile');
      if (profile) {
        logger.info('[UserDashboard] Profile loaded successfully');
      }
    }
  }, [isAuthenticated, profile, loading]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="home" element={<HomeSection />} />
        <Route path="matches" element={<MatchesSection />} />
        <Route path="messages" element={<MessagesSection />} />
        <Route path="profile" element={<ProfileSection />} />
        <Route path="premium" element={<PremiumSection />} />
        <Route path="settings" element={<SettingsSection />} />
        <Route path="" element={<Navigate to="home" replace />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
