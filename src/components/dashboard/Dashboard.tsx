import React from 'react';
import { DashboardNavbar } from './DashboardNavbar';
import { MobileSidebar } from './MobileSidebar';
import { SwipeSection } from './SwipeSection';
import { MatchesDrawer } from './MatchesDrawer';
import { ChatDrawer } from './ChatDrawer';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <div className="pt-16 pb-20 md:pb-0 flex">
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <SwipeSection />
        </main>

        {/* Matches Drawer - Hidden on mobile */}
        <div className="hidden md:block">
          <MatchesDrawer />
        </div>

        {/* Chat Drawer - Hidden on mobile */}
        <div className="hidden md:block">
          <ChatDrawer />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileSidebar />
    </div>
  );
}