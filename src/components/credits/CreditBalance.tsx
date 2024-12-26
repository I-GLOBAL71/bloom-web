import React from 'react';
import { motion } from 'framer-motion';
import { Flower, TrendingUp, Gift } from 'lucide-react';
import { useCreditStore } from './store/creditStore';
import { useTranslation } from 'react-i18next';

export function CreditBalance() {
  const { t } = useTranslation();
  const { balance, subscription } = useCreditStore();

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t('credits.title')}</h2>
          <div className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
            <Flower className="w-8 h-8" />
            {balance}
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="w-5 h-5" />
            {t('credits.buy')}
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-6 py-3 border-2 border-pink-200 text-pink-500 rounded-xl hover:bg-pink-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Gift className="w-5 h-5" />
            {t('credits.earn')}
          </motion.button>
        </div>
      </div>

      {subscription && (
        <div className="p-4 bg-gradient-to-r from-amber-100 to-pink-100 rounded-xl">
          <p className="font-medium">
            {t(`credits.packages.${subscription.type}`)}
          </p>
        </div>
      )}
    </div>
  );
}