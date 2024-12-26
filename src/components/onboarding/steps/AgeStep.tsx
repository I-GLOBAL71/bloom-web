import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepProps } from '../types';

export function AgeStep({ onNext, onBack, data = '', isFirstStep }: OnboardingStepProps) {
  const [age, setAge] = useState(data);
  const minAge = 18;
  const maxAge = 99;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age) {
      onNext(age);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Quel âge avez-vous ?</h2>
        <p className="text-gray-600">Votre âge nous aide à vous proposer des profils pertinents</p>
      </div>

      <div className="relative">
        <motion.select
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-4 text-lg border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 transition-colors appearance-none"
          whileFocus={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <option value="">Sélectionnez votre âge</option>
          {Array.from({ length: maxAge - minAge + 1 }, (_, i) => (
            <option key={i} value={minAge + i}>
              {minAge + i} ans
            </option>
          ))}
        </motion.select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

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
          disabled={!age}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuer
        </motion.button>
      </div>
    </form>
  );
}