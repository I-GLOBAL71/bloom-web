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
