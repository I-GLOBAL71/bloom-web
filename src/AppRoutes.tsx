import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { MessagesPage } from './pages/MessagesPage';
import { AdminPage } from './pages/AdminPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import { UserProfile } from './components/profile/UserProfile';
import { ContactRequestsPage } from './pages/ContactRequestsPage';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/auth/PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/email-signin" element={<AuthPage />} />

      {/* Routes protégées sans layout */}
      <Route path="/onboarding" element={
        <PrivateRoute requireOnboarding={false}>
          <OnboardingPage />
        </PrivateRoute>
      } />
      
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminPage />
        </PrivateRoute>
      } />

      {/* Routes protégées avec layout */}
      <Route path="/app" element={<AppLayout hideFooter />}>
        <Route index element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        
        <Route path="dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        
        <Route path="events" element={
          <PrivateRoute>
            <EventsPage />
          </PrivateRoute>
        } />
        
        <Route path="messages" element={
          <PrivateRoute>
            <Routes>
              <Route index element={<MessagesPage view="list" />} />
              <Route path="chat/:userId" element={<MessagesPage view="chat" />} />
            </Routes>
          </PrivateRoute>
        } />
        
        <Route path="profile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
        
        <Route path="contact-requests" element={
          <PrivateRoute>
            <ContactRequestsPage />
          </PrivateRoute>
        } />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default AppRoutes;