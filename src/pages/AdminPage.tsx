import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';

export function AdminPage() {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Vérification du rôle admin à implémenter
  // Pour l'instant, utilisation basique
  if (!user.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6">
          {/* Contenu de la section active */}
          <h1 className="text-2xl font-semibold text-gray-900">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
        </main>
      </div>
    </div>
  );
}

export default AdminPage;