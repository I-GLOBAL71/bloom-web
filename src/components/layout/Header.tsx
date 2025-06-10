import React, { useState } from 'react';
import { Menu, X, LogOut, Home, MessageCircle, Calendar, User, Globe, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '../ui/Logo';
import { AuthButtons } from '../auth/AuthButtons';
import { signOut } from '../../lib/firebase/auth';
import { CurrencyDisplay } from '../dashboard/CurrencyDisplay';
import { NotificationBadge } from '../notifications/NotificationBadge';
import { LanguageSelector } from '../ui/LanguageSelector';

interface NavigationItem {
  name: string;
  href: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  component?: () => React.ReactNode;
}

interface HeaderProps {
  isDashboard?: boolean;
  petals?: number;
  flowers?: number;
  onBuyPetals?: () => void;
  onWithdrawFlowers?: () => void;
  onNotificationClick?: () => void;
  notifications?: React.ReactNode;
  className?: string;
}

export function Header({
  className,
  isDashboard = false,
  petals,
  flowers,
  onBuyPetals,
  onWithdrawFlowers,
  onNotificationClick,
  notifications
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(['landing', 'dashboard', 'common']);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const defaultNavigation: NavigationItem[] = [
    { name: t('nav.features', { ns: 'landing' }), href: '#features' },
    { name: t('nav.events', { ns: 'landing' }), href: '#events' },
    { name: t('nav.pricing', { ns: 'landing' }), href: '#pricing' },
    { name: t('nav.about', { ns: 'landing' }), href: '#about' }
  ];

  const dashboardNavigation: NavigationItem[] = [
    { name: t('nav.contacts', { ns: 'dashboard' }), href: '/app/contact-requests', icon: UserPlus },
    { name: t('logout', { ns: 'common' }), href: '#', onClick: handleLogout, icon: LogOut }
  ];

  const navigation = isDashboard ? dashboardNavigation : defaultNavigation;

  return (
    <div className="relative w-full">
      <div className="h-16" /> {/* Spacer for header height */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo section */}
              <div className="flex items-center">
                <Link to={isDashboard ? "/app/dashboard" : "/"} className="block">
                  <Logo className="h-16 w-auto" />
                </Link>
                {isDashboard && (
                  <div className="hidden md:block ml-6">
                    <CurrencyDisplay
                      petals={petals || 0}
                      flowers={flowers || 0}
                      onBuyPetals={onBuyPetals}
                      onWithdrawFlowers={onWithdrawFlowers}
                    />
                  </div>
                )}
              </div>

              {/* Navigation */}
              {isDashboard ? (
                <div className="hidden md:flex items-center space-x-6">
                  {navigation.map((item) => (
                    item.component ? (
                      <div key={item.name} className="relative">
                        {item.component()}
                      </div>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={item.onClick}
                        className="flex items-center text-gray-600 hover:text-pink-500 transition-colors"
                      >
                        {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-600 hover:text-pink-500 transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="border-l border-gray-300 pl-8">
                    <LanguageSelector />
                  </div>
                </div>
              )}

              {/* Auth buttons */}
              {!isDashboard && (
                <div className="hidden md:block w-[300px]">
                  <AuthButtons />
                </div>
              )}

              {/* Mobile menu and notifications */}
              <div className="flex items-center gap-4">
                {isDashboard && (
                  <>
                    <div className="md:hidden">
                      <CurrencyDisplay
                        petals={petals || 0}
                        flowers={flowers || 0}
                        onBuyPetals={onBuyPetals}
                        onWithdrawFlowers={onWithdrawFlowers}
                      />
                    </div>
                    {notifications || (
                      <NotificationBadge onClick={onNotificationClick} className="block" />
                    )}
                  </>
                )}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-gray-600 hover:text-pink-500 transition-colors"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu with transitions */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <div
              className="absolute top-full left-0 right-0 bg-white border-t border-pink-100 shadow-lg z-50"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  item.component ? (
                    <div key={item.name} className="w-full">
                      <div className="flex items-center px-4 py-3 text-gray-600">
                        {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                        {item.component()}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => {
                        item.onClick?.();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-pink-500 transition-colors rounded-lg"
                    >
                      {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                      {item.name}
                    </Link>
                  )
                ))}

                {!isDashboard && (
                  <div className="border-t border-pink-100 pt-4 px-4 mt-4">
                    <AuthButtons />
                  </div>
                )}

                <div className="border-t border-pink-100 pt-4 mt-4">
                  <div className="px-4">
                    <LanguageSelector />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </div>
  );
}