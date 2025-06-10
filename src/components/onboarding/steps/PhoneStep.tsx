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