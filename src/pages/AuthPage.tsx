import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthMethods } from '../components/auth/AuthMethods';
import { logger } from '../utils/logger';

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    logger.info('AuthPage', 'Component mounted', {
      path: location.pathname
    });
  }, [location]);

  const handleSuccess = () => {
    logger.info('AuthPage', 'Authentication successful');
    // Rediriger vers l'onboarding au lieu du dashboard
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Se connecter à Bloom
          </h2>
          
          <AuthMethods onSuccess={handleSuccess} />
        </div>
      </motion.div>
    </div>
  );
}
