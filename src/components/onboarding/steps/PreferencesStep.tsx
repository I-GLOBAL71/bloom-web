import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User2, UserCircle2, Users } from 'lucide-react';
import { OnboardingStepProps } from '../types';

interface ExtendedOnboardingStepProps extends OnboardingStepProps {
  data?: string[];
}

const profileTypes = [
  {
    id: 'rose',
    label: 'Des Roses',
    description: 'Femmes (cis ou trans)',
    icon: <UserCircle2 className="w-6 h-6" />
  },
  {
    id: 'bourdon',
    label: 'Des Bourdons',
    description: 'Hommes (cis ou trans)',
    icon: <User2 className="w-6 h-6" />
  },
  {
    id: 'jardin',
    label: 'Des Jardins',
    description: 'Personnes non-binaires',
    icon: <Users className="w-6 h-6" />
  }
];

export function PreferencesStep({ onNext, onBack, data = [], isFirstStep }: ExtendedOnboardingStepProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(data);

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypes.length > 0) {
      onNext(selectedTypes);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Qui souhaitez-vous rencontrer ?</h2>
        <p className="text-gray-600">Sélectionnez un ou plusieurs types de profils</p>
      </div>

      <div className="space-y-4">
        {profileTypes.map((type) => (
          <motion.button
            key={type.id}
            type="button"
            onClick={() => toggleType(type.id)}
            className={`
              w-full p-4 flex items-center gap-4 rounded-xl border-2 text-left
              ${selectedTypes.includes(type.id)
                ? 'border-pink-500 bg-pink-50'
                : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
              }
              transition-colors
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
              {type.icon}
            </div>
            <div>
              <div className="font-medium">{type.label}</div>
              <div className="text-sm text-gray-600">{type.description}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        type="submit"
        className="w-full px-8 py-4 bg-pink-500 text-white rounded-full text-lg hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedTypes.length === 0}
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