import React from 'react';
import { motion } from 'framer-motion';
import { CustomPhoneInput } from '../../auth/PhoneInput';
import { OnboardingStepProps } from '../../../types/onboarding';

export function PhoneStep({ onNext, onBack, data, isFirstStep }: OnboardingStepProps) {
  const [phone, setPhone] = React.useState(data?.phone || '');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    onNext({ phone });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Votre numéro de téléphone</h2>
        <p className="text-gray-600">
          Pour sécuriser votre compte et vous contacter si nécessaire
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomPhoneInput value={phone} onChange={setPhone} />

        <div className="flex justify-between pt-4">
          <motion.button
            type="button"
            onClick={onBack}
            className={`px-6 py-2 rounded-full border-2 border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors ${
              isFirstStep ? 'invisible' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retour
          </motion.button>
          
          <motion.button
            type="submit"
            className="px-8 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full hover:opacity-90 transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continuer
          </motion.button>
        </div>
      </form>
    </div>
  );
}
