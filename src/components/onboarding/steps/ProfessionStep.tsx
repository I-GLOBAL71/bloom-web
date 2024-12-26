import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { OnboardingStepProps } from '../types';

const professions = [
  'Étudiant(e)',
  'Employé(e)',
  'Cadre',
  'Entrepreneur(e)',
  'Profession libérale',
  'Artiste',
  'En recherche d\'emploi',
  'Autre'
];

export function ProfessionStep({ onNext, onBack, data = '', isFirstStep }: OnboardingStepProps) {
  const [profession, setProfession] = useState(data);
  const [customProfession, setCustomProfession] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(data === 'Autre');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalValue = profession === 'Autre' ? customProfession : profession;
    if (finalValue.trim()) {
      onNext(finalValue.trim());
    }
  };

  const handleProfessionSelect = (selected: string) => {
    setProfession(selected);
    setShowCustomInput(selected === 'Autre');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Quelle est votre situation professionnelle ?</h2>
        <p className="text-gray-600">Cette information nous aide à mieux vous connaître</p>
      </div>

      <div className="grid gap-4">
        {professions.map((prof) => (
          <motion.button
            key={prof}
            type="button"
            onClick={() => handleProfessionSelect(prof)}
            className={`
              w-full p-4 flex items-center gap-4 rounded-xl border-2 text-left
              ${profession === prof 
                ? 'border-pink-500 bg-pink-50' 
                : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
              }
              transition-colors
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="font-medium">{prof}</div>
          </motion.button>
        ))}
      </div>

      {showCustomInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <input
            type="text"
            value={customProfession}
            onChange={(e) => setCustomProfession(e.target.value)}
            placeholder="Précisez votre profession"
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
          />
        </motion.div>
      )}

      <motion.button
        type="submit"
        className="w-full px-8 py-4 bg-pink-500 text-white rounded-full text-lg hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!profession || (profession === 'Autre' && !customProfession.trim())}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continuer
      </motion.button>

      {!isFirstStep && (
        <motion.button
          type="button"
          onClick={onBack}
          className="w-full px-8 py-4 border-2 border-pink-500 text-pink-500 rounded-full text-lg hover:bg-pink-50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Retour
        </motion.button>
      )}
    </form>
  );
}