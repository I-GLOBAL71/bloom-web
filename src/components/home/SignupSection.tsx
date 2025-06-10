import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { fadeInUp, slideInFromRight } from '../animations/variants';
import { Heart } from 'lucide-react';
import { ProfileTypeSelection } from '../ui/ProfileTypeSelection';
import { logger } from '../../utils/logger';

export const SignupSection = () => {
  const [profileType, setProfileType] = useState<string>();
  const [searchingFor, setSearchingFor] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    logger.info('SignupSection', 'Component mounted', {
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.info('SignupSection', 'Component unmounted', {
        timestamp: new Date().toISOString()
      });
    };
  }, [location.pathname]);

  const handleProfileTypeChange = useCallback((type: string) => {
    logger.info('SignupSection', 'Profile type changed', { type });
    setProfileType(type);
  }, []);

  const handleSearchingForChange = useCallback((type: string) => {
    logger.info('SignupSection', 'Searching for changed', { type });
    setSearchingFor(type);
  }, []);

  const handleSignup = useCallback(() => {
    // Prevent navigation if already on login page
    if (location.pathname === '/login') {
      logger.info('SignupSection', 'Navigation prevented', {
        reason: 'already-on-login-page'
      });
      return;
    }

    // Only proceed if at least one preference is selected
    if (!profileType && !searchingFor) {
      logger.info('SignupSection', 'Signup incomplete', {
        message: 'No preferences selected'
      });
      return;
    }

    const params = new URLSearchParams();
    if (profileType) params.append('type', profileType);
    if (searchingFor) params.append('seeking', searchingFor);
    
    logger.info('SignupSection', 'Signup initiated', {
      action: 'signup',
      profileType,
      searchingFor,
      params: params.toString()
    });

    navigate(`/login?${params.toString()}`);
  }, [profileType, searchingFor, location.pathname, navigate]);

  return (
    <div className="py-20 px-6">
      <div className="container mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-pink-500/20 blur-3xl"
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
          <div className="relative bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                className="md:w-1/2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-4xl font-bold mb-6">
                  Prêt à faire fleurir
                  <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent"> l'amour</span> ?
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Rejoignez notre communauté et commencez votre histoire dès aujourd'hui.
                </p>
                <motion.button 
                  onClick={handleSignup}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-5 h-5" />
                  Créer mon profil
                </motion.button>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInFromRight}
              >
                <form className="space-y-8">
                  <ProfileTypeSelection
                    label="Je suis"
                    value={profileType}
                    onChange={handleProfileTypeChange}
                  />
                  <ProfileTypeSelection
                    label="Je cherche"
                    value={searchingFor}
                    onChange={handleSearchingForChange}
                    isSearching
                  />
                  <motion.input
                    type="email"
                    placeholder="Votre email"
                    className="w-full p-4 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 transition-colors"
                    whileFocus={{ scale: 1.02 }}
                  />
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}