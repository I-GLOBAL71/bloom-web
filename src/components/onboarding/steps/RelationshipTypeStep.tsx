import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, HeartHandshake, Users2, Coffee } from 'lucide-react';
import { OnboardingStepProps } from '../types';

interface RelationshipTypeStepProps {
  onNext: (value: string) => void;
  onBack: () => void;
  data?: string;
  isFirstStep: boolean;
}

const relationshipTypes = [
  {
    id: 'serious',
    label: 'Relation sérieuse',
    description: 'Je cherche une relation durable',
    icon: Heart
  },
  {
    id: 'casual',
    label: 'Relation décontractée',
    description: 'Je préfère prendre mon temps',
    icon: HeartHandshake
  },
  {
    id: 'friendship',
    label: 'Amitié',
    description: 'Je souhaite faire des rencontres amicales',
    icon: Users2
  },
  {
    id: 'undecided',
    label: 'Je verrai bien',
    description: 'Je suis ouvert(e) aux possibilités',
    icon: Coffee
  }
];

export function RelationshipTypeStep({ onNext, onBack, data = '', isFirstStep }: RelationshipTypeStepProps) {
  const [selectedType, setSelectedType] = useState(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onNext(selectedType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Quel type de relation recherchez-vous ?</h2>
        <p className="text-gray-600">Choisissez ce qui correspond le mieux à vos attentes</p>
      </div>

      <div className="space-y-4">
        {relationshipTypes.map(({ id, label, description, icon: Icon }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => setSelectedType(id)}
            className={`
              w-full p-4 flex items-center gap-4 rounded-xl border-2 text-left
              ${selectedType === id
                ? 'border-pink-500 bg-pink-50'
                : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
              }
              transition-colors
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-sm text-gray-600">{description}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        type="submit"
        className="w-full px-8 py-4 bg-pink-500 text-white rounded-full text-lg hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedType}
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