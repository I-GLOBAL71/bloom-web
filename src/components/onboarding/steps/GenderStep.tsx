import React from 'react';
import { motion } from 'framer-motion';
import { User2, UserCircle2, Users } from 'lucide-react';
import { OnboardingStepProps } from '../types';

const genderOptions = [
  {
    id: 'rose',
    label: 'Une Rose',
    description: 'Femme (cis ou trans)',
    icon: <UserCircle2 className="w-6 h-6" />
  },
  {
    id: 'bourdon',
    label: 'Un Bourdon',
    description: 'Homme (cis ou trans)',
    icon: <User2 className="w-6 h-6" />
  },
  {
    id: 'jardin',
    label: 'Un Jardin',
    description: 'Non-binaire / Autre',
    icon: <Users className="w-6 h-6" />
  }
];

export function GenderStep({ onNext, onBack, data = '', isFirstStep }: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Comment vous identifiez-vous ?</h2>
        <p className="text-gray-600">Choisissez l'option qui vous correspond le mieux</p>
      </div>

      <div className="grid gap-4">
        {genderOptions.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onNext(option.id)}
            className={`
              w-full p-4 flex items-center gap-4 rounded-xl border-2 text-left
              ${data === option.id 
                ? 'border-pink-500 bg-pink-50' 
                : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
              }
              transition-colors
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
              {option.icon}
            </div>
            <div>
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </div>
          </motion.button>
        ))}
      </div>

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
    </div>
  );
}