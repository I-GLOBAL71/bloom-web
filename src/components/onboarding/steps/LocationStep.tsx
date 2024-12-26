import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { CityInput } from '../../auth/CityInput';

interface OnboardingStepProps {
  onNext: (value: any) => void;
  onBack: () => void;
  data?: string;
  isFirstStep?: boolean;
}

export function LocationStep({ onNext, onBack, data = '', isFirstStep }: OnboardingStepProps) {
  const [location, setLocation] = useState(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onNext(location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Où êtes-vous situé(e) ?</h2>
        <p className="text-gray-600">Pour vous proposer des rencontres près de chez vous</p>
      </div>

      <CityInput 
        value={location}
        onChange={setLocation}
        onSelect={(location) => {
          setLocation(location.display_name);
        }}
      />

      <motion.button
        type="submit"
        className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
        disabled={!location.trim()}
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