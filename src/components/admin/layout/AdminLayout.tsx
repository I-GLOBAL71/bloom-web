import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAdminStore } from '../store/adminStore';
import { AdminContent } from './AdminContent';
import { LoginForm } from '../auth/LoginForm';
import { useAdminAuthStore } from '../store/authStore';

export function AdminLayout() {
  const { activeSectionId } = useAdminStore();
  const { isAuthenticated, loading } = useAdminAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto">
            <AdminContent sectionId={activeSectionId} />
          </div>
        </main>
      </div>
    </div>
  );
}