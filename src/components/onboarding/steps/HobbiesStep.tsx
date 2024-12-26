import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Book, Palette, Camera, Bike, Plane, Coffee, Film, Gamepad2, Utensils } from 'lucide-react';
import { OnboardingStepProps } from '../types';

const hobbies = [
  { id: 'musique', label: 'Musique', icon: Music },
  { id: 'lecture', label: 'Lecture', icon: Book },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'photo', label: 'Photographie', icon: Camera },
  { id: 'sport', label: 'Sport', icon: Bike },
  { id: 'voyage', label: 'Voyage', icon: Plane },
  { id: 'gastronomie', label: 'Gastronomie', icon: Utensils },
  { id: 'cinema', label: 'Cinéma', icon: Film },
  { id: 'jeuxVideo', label: 'Jeux vidéo', icon: Gamepad2 },
  { id: 'sorties', label: 'Sorties', icon: Coffee }
];

interface ExtendedOnboardingStepProps extends OnboardingStepProps {
  data?: string[];
}

export function HobbiesStep({ onNext, onBack, data = [], isFirstStep }: ExtendedOnboardingStepProps) {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(data);
  const [customHobby, setCustomHobby] = useState('');

  const toggleHobby = (hobbyId: string) => {
    setSelectedHobbies(prev => 
      prev.includes(hobbyId)
        ? prev.filter(id => id !== hobbyId)
        : prev.length < 5 
          ? [...prev, hobbyId]
          : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHobbies.length > 0) {
      const finalHobbies = [...selectedHobbies];
      if (customHobby.trim()) {
        finalHobbies.push(customHobby.trim());
      }
      onNext(finalHobbies);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Quels sont vos centres d'intérêt ?</h2>
        <p className="text-gray-600">Sélectionnez au moins un centre d'intérêt (maximum 5)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {hobbies.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => toggleHobby(id)}
            disabled={selectedHobbies.length >= 5 && !selectedHobbies.includes(id)}
            className={`
              p-4 rounded-xl border-2 text-left
              ${selectedHobbies.includes(id)
                ? 'border-pink-500 bg-pink-50'
                : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
              }
              transition-colors disabled:opacity-50
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-medium">{label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={customHobby}
          onChange={(e) => setCustomHobby(e.target.value)}
          placeholder="Autre passion ? Précisez ici"
          className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
          maxLength={30}
        />
      </div>

      <motion.button
        type="submit"
        className="w-full px-8 py-4 bg-pink-500 text-white rounded-full text-lg hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedHobbies.length === 0}
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