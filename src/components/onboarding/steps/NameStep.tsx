import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps } from '../types';

export function NameStep({ onNext, onBack, data = '', isFirstStep }: OnboardingStepProps) {
  const [name, setName] = useState(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name?.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Comment souhaitez-vous qu'on vous appelle ?</h2>
        <p className="text-gray-600">Choisissez un prénom ou un pseudo qui vous représente</p>
      </div>

      <motion.input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-4 text-lg border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 transition-colors"
        placeholder="Votre prénom ou pseudo"
        whileFocus={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      />

      <div className="flex gap-4">
        {!isFirstStep && (
          <motion.button
            type="button"
            onClick={onBack}
            className="flex-1 px-8 py-4 border-2 border-pink-500 text-pink-500 rounded-full text-lg hover:bg-pink-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retour
          </motion.button>
        )}
        <motion.button
          type="submit"
          className="flex-1 px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
          disabled={!name?.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuer
        </motion.button>
      </div>
    </form>
  );
}