<<<<<<< HEAD
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
=======
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bloomLogo from '/bloom-logo.svg';
import { logger } from '../../utils/logger';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    logger.info('Header', 'Component mounted', {
      isAuthenticated: !!currentUser,
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.info('Header', 'Component unmounted', {
        timestamp: new Date().toISOString()
      });
    };
  }, []); // Only log on initial mount

  const handleLogout = useCallback(async () => {
    try {
      logger.info('Header', 'Logout attempt');
      await logout();
      logger.info('Header', 'Logout success');
      navigate('/');
    } catch (error) {
      logger.error('Header', error, { action: 'logout' });
    }
  }, [logout, navigate]);

  const handleNavigation = useCallback((to: string) => {
    logger.info('Header', 'Navigation', {
      to,
      isAuthenticated: !!currentUser,
      currentPath: location.pathname
    });
    navigate(to);
  }, [currentUser, location.pathname, navigate]);

  const handleLoginNavigation = useCallback((type: 'login' | 'signup') => {
    logger.info('Header', 'Login navigation', { type });
    navigate('/login', { state: { authMode: type } });
  }, [navigate]);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => logger.info('Header', 'Navigation', { to: '/' })}>
            <img
              src={bloomLogo}
              alt="Bloom"
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/about"
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
              onClick={() => logger.info('Header', 'Navigation', { to: '/about' })}
            >
              À propos
            </Link>
            <Link
              to="/features"
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
              onClick={() => logger.info('Header', 'Navigation', { to: '/features' })}
            >
              Fonctionnalités
            </Link>
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
                  onClick={() => handleLoginNavigation('login')}
                >
                  Connexion
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                  onClick={() => handleLoginNavigation('signup')}
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
                  onClick={() => logger.info('Header', 'Navigation', { to: '/dashboard' })}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                >
                  Déconnexion
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
          <div className="flex flex-col space-y-4">
            <Link
              to="/about"
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
              onClick={() => logger.info('Header', 'Navigation', { to: '/about' })}
            >
              À propos
            </Link>
            <Link
              to="/features"
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
              onClick={() => logger.info('Header', 'Navigation', { to: '/features' })}
            >
              Fonctionnalités
            </Link>
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
                  onClick={() => handleLoginNavigation('login')}
                >
                  Connexion
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 text-center bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                  onClick={() => handleLoginNavigation('signup')}
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-200"
                  onClick={() => logger.info('Header', 'Navigation', { to: '/dashboard' })}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
