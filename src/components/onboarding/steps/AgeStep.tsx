import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StepCard } from '../StepCard';
import { GradientButton } from '../../ui/GradientButton';

interface AgeStepProps {
  onNext: (data: { age: number }) => void;
  initialValue: number | '';
  onBack?: () => void;
}

export function AgeStep({ onNext, initialValue, onBack }: AgeStepProps) {
  const { t } = useTranslation('onboarding');
  const [ageInput, setAgeInput] = useState(initialValue.toString());
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const age = parseInt(ageInput, 10);
    if (isNaN(age) || age < 18 || age > 120) {
      setError(t('errors.invalidAge'));
      return;
    }
    
    onNext({ age });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAgeInput(value);
    setError('');
  };

  return (
    <StepCard
      icon={UserCircle}
      title={t('steps.age.title')}
      subtitle={t('steps.age.subtitle')}
      onBack={onBack}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="number"
            value={ageInput}
            onChange={handleAgeChange}
            min="18"
            max="120"
            placeholder={t('steps.age.placeholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-colors"
          />
          {error && (
            <p className="mt-2 text-sm text-rose-500">{error}</p>
          )}
        </div>

        <GradientButton type="submit" fullWidth>
          {t('continue')}
        </GradientButton>
      </form>
    </StepCard>
  );
}
