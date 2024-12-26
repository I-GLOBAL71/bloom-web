import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { fadeInUp, slideInFromLeft, slideInFromRight } from '../animations/variants';
import { logger } from '../../utils/logger';

export function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    logger.info('HeroSection', 'Component mounted', {
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.info('HeroSection', 'Component unmounted', {
        timestamp: new Date().toISOString()
      });
    };
  }, [location.pathname]);

  const handleStartAdventure = useCallback(() => {
    // Prevent navigation if already on login page
    if (location.pathname === '/login') {
      logger.info('HeroSection', 'Navigation prevented', {
        reason: 'already-on-login-page',
        timestamp: new Date().toISOString()
      });
      return;
    }

    logger.info('HeroSection', 'Navigation to login page', {
      action: 'start-adventure',
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });
    navigate('/login');
  }, [location.pathname, navigate]);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/2 space-y-8"
            initial="hidden"
            animate="visible"
            variants={slideInFromLeft}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              Trouvez l'amour qui vous fait
              <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent"> fleurir</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700"
              variants={fadeInUp}
            >
              Découvrez des connexions authentiques dans un environnement bienveillant et élégant.
            </motion.p>
            <motion.button 
              onClick={handleStartAdventure}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer l'aventure
            </motion.button>
          </motion.div>
          <motion.div 
            className="md:w-1/2 mt-12 md:mt-0"
            initial="hidden"
            animate="visible"
            variants={slideInFromRight}
          >
            <div className="relative">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-pink-500/20 rounded-3xl blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5] 
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              <motion.img
                src="https://images.unsplash.com/photo-1621275471769-e6aa344546d5?w=800&auto=format&fit=crop"
                alt="Couple heureux"
                className="relative rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}