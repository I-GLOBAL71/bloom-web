import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';

export function PremiumSection() {
  const features = [
    "Voir qui vous a liké",
    "Messages illimités",
    "Filtres de recherche avancés",
    "Mode invisible",
    "Boost de profil mensuel",
    "Badge premium exclusif"
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Crown className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Premium</h1>
      </motion.div>

      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-amber-100 to-pink-100 rounded-2xl p-8 text-center">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">Passez à Bloom Premium</h2>
          <p className="text-gray-600 mb-8">
            Profitez d'une expérience de rencontre optimale avec des fonctionnalités exclusives
          </p>

          <div className="bg-white rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Fonctionnalités Premium</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            className="bg-gradient-to-r from-amber-400 to-pink-500 text-white px-8 py-3 rounded-full font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Devenir Premium
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
