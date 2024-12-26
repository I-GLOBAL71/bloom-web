import React from 'react';
import { motion } from 'framer-motion';

export function HomeSection() {
  return (
    <div className="space-y-6">
      <motion.h1 
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Bienvenue sur Bloom
      </motion.h1>
      
      <motion.div 
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Suggestions du jour */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Suggestions du jour</h2>
          <div className="space-y-4">
            {/* Placeholder pour les suggestions */}
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <div className="space-y-4">
            {/* Placeholder pour l'activité */}
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
