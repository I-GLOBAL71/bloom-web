import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Bell, Loader2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationsList from '../notifications/NotificationsList';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BuyPetalsModal } from '../payment/BuyPetalsModal';
import { FlowersModal } from '../payment/FlowersModal';

interface AppLayoutProps {
  hideFooter?: boolean;
}

export function AppLayout({ hideFooter = false }: AppLayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBuyPetalsModal, setShowBuyPetalsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { notifications, loading } = useNotifications();
  const { user } = useAuth();
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;
  const isDashboard = location.pathname.includes('/app');

  const handleBuyPetals = () => {
    setShowBuyPetalsModal(true);
  };

  const handleWithdrawFlowers = () => {
    setShowWithdrawModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        isDashboard={isDashboard}
        petals={user?.petals || 0}
        flowers={user?.flowers || 0}
        onBuyPetals={handleBuyPetals}
        onWithdrawFlowers={handleWithdrawFlowers}
        notifications={
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-pink-500 transition-colors relative"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                    </div>
                  ) : (
                    <NotificationsList onClose={() => setShowNotifications(false)} />
                  )}
                </div>
              </>
            )}
          </div>
        }
      />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}

      {/* Modales */}
      {showBuyPetalsModal && user && (
        <BuyPetalsModal
          user={user}
          isOpen={showBuyPetalsModal}
          onClose={() => setShowBuyPetalsModal(false)}
        />
      )}
      {showWithdrawModal && user && (
        <FlowersModal
          user={user}
          flowers={user.flowers || 0}
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  );
}