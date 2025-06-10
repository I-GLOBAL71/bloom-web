import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StepCard } from '../StepCard';
import { GradientButton } from '../../ui/GradientButton';

interface UsernameStepProps {
  onNext: (data: { username: string }) => void;
  initialValue: string;
  onBack?: () => void;
}

export function UsernameStep({ onNext, initialValue, onBack }: UsernameStepProps) {
  const { t } = useTranslation('common');
  const [username, setUsername] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.length < 3) {
      setError(t('errors.usernameTooShort'));
      return;
    }
    
    onNext({ username });
  };

  return (
    <StepCard
      icon={Leaf}
      title={t('onboarding.steps.username.title')}
      subtitle={t('onboarding.steps.username.subtitle')}
      onBack={onBack}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder={t('onboarding.steps.username.placeholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-colors"
          />
          {error && (
            <p className="mt-2 text-sm text-rose-500">{error}</p>
          )}
        </div>

        <GradientButton type="submit" fullWidth>
          {t('onboarding.continue')}
        </GradientButton>
      </form>
    </StepCard>
  );
}
