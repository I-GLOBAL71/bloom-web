import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bloomLogo from '/bloom-logo.svg';
import { splashLogger } from '../utils/splashLogger';

const FADE_DURATION = 3500; // Début du fade-out à 3.5 secondes
const REDIRECT_DURATION = 4000; // Redirection à 4 secondes

const SplashScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fadeOut, setFadeOut] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Éviter les rendus multiples
    if (location.pathname !== '/splash') {
      return;
    }

    splashLogger.mounted();

    const fadeTimeout = setTimeout(() => {
      splashLogger.fadeOut();
      setFadeOut(true);
    }, FADE_DURATION);

    // Rediriger vers la page d'accueil après 3 secondes
    const redirectTimeout = setTimeout(() => {
      if (!isNavigating) {
        setIsNavigating(true);
        splashLogger.navigationAttempt();
        
        try {
          navigate('/home', { replace: true });
          splashLogger.navigationSuccess();
        } catch (error) {
          splashLogger.navigationError(error);
          // Tentative de redirection de secours
          window.location.href = '/home';
        }
      }
    }, REDIRECT_DURATION);

    return () => {
      splashLogger.cleanup();
      clearTimeout(fadeTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate, location.pathname, isNavigating]);

  // Ne rien afficher si nous ne sommes pas sur /splash
  if (location.pathname !== '/splash') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-200 via-rose-200 to-pink-200 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        <img
          src={bloomLogo}
          alt="Bloom Logo"
          className="w-96 h-96 animate-pulse"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
