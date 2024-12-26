import React from 'react';
import { Sidebar } from '../navigation/Sidebar';
import { MobileNavbar } from '../navigation/MobileNavbar';
import { useAuth } from "../../../contexts/AuthContext";
import { useCredits } from '../../../hooks/useCredits';
import Header from "../../../components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut } = useAuth();
  const { credits } = useCredits();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex pt-16">
        <Sidebar onLogout={signOut} credits={credits} />
        <main className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNavbar />
    </div>
  );
}