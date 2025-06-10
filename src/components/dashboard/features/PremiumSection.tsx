import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PremiumSection() {
  const { t } = useTranslation();

  const features = [
    'Likes illimités',
    'Voir qui vous a liké',
    'Super Likes illimités',
    'Boost hebdomadaire',
    'Messages prioritaires',
    'Annulation du dernier swipe',
    'Pas de publicités'
  ];

  return (
    <div className="h-full p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Bloom Premium</h2>
          <p className="text-gray-600">Débloquez toutes les fonctionnalités pour une expérience optimale</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-1 bg-green-100 rounded-full">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button
          className="w-full py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-xl font-medium shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Devenir Premium
        </motion.button>
      </div>
    </div>
  );
}