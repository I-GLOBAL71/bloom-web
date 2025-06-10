<<<<<<< HEAD
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StepCard } from '../StepCard';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type PhoneInputEvent = (value: string, country: CountryData) => void;

interface PhoneStepProps {
  onNext: (data: { phone: string; countryCode: string }) => void;
  initialPhone: string;
  initialCountryCode: string;
  onBack?: () => void;
}

export function PhoneStep({ 
  onNext, 
  initialPhone, 
  initialCountryCode,
  onBack
}: PhoneStepProps) {
  const { t, i18n } = useTranslation();
  console.log('Current language:', i18n.language);
  console.log('Translation for title:', t('onboarding.steps.phone.title'));
  console.log('Translation for subtitle:', t('onboarding.steps.phone.subtitle'));
  console.log('Translation for placeholder:', t('onboarding.steps.phone.placeholder'));
  console.log('Translation for continue:', t('onboarding.steps.phone.continue'));
  console.log('Translation for verification:', t('onboarding.steps.phone.verification'));
  const [phone, setPhone] = useState(initialPhone);
  const [countryCode, setCountryCode] = useState(initialCountryCode || '1'); // Default to US
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError(t('onboarding.steps.phone.errors.required'));
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^\d{6,14}$/;
    if (!phoneRegex.test(phone)) {
      setError(t('onboarding.steps.phone.errors.invalid'));
      return;
    }
    
    onNext({ phone, countryCode });
  };

  return (
    <StepCard
      icon={Phone}
      title={t('onboarding.steps.phone.title')}
      subtitle={t('onboarding.steps.phone.subtitle')}
      onBack={onBack}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PhoneInput
          country={'fr'}
          value={phone}
          onChange={(value: string, country: CountryData) => {
            setPhone(value);
            setCountryCode(country.dialCode || '');
            setError('');
          }}
          inputStyle={{
            width: '100%',
            height: '48px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '2px solid #FDE68A',
            backgroundColor: 'white'
          }}
          buttonStyle={{
            borderRadius: '12px 0 0 12px',
            border: '2px solid #FDE68A',
            borderRight: 'none',
            backgroundColor: 'white'
          }}
          containerStyle={{
            width: '100%'
          }}
          dropdownStyle={{
            width: '300px',
            maxHeight: '300px',
            borderRadius: '8px',
            border: '2px solid #FDE68A'
          }}
          searchStyle={{
            width: '100%',
            height: '36px',
            padding: '8px',
            margin: '4px 0',
            borderRadius: '8px',
            border: '1px solid #FDE68A'
          }}
          placeholder={t('onboarding.steps.phone.placeholder')}
        />
        
        {error && (
          <p className="text-sm text-rose-500">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-xl font-medium hover:from-amber-500 hover:to-rose-500 transition-colors"
        >
          {t('onboarding.steps.phone.continue')}
        </button>

        <p className="text-center text-sm text-gray-500">
          {t('onboarding.steps.phone.verification')}
        </p>
      </form>
    </StepCard>
  );
}
=======
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
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
