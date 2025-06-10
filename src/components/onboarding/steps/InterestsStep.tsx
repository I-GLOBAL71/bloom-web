import React, { useState } from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../contexts/LanguageContext';
import { StepCard } from '../StepCard';
import { INTEREST_CATEGORIES } from '../../../constants/interests';
import { motion } from 'framer-motion';

interface InterestsStepProps {
  onNext: (data: { interests: string[] }) => void;
  initialValue: string[];
  onBack?: () => void;
}

const MotionCard = motion.div;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function InterestsStep({ onNext, initialValue, onBack }: InterestsStepProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialValue);
  const [error, setError] = useState('');
  const isRTL = ['ar', 'ur'].includes(currentLanguage);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      }
      if (prev.length >= 5) {
        setError(t('errors.maxInterests'));
        return prev;
      }
      setError('');
      return [...prev, interestId];
    });
  };

  const handleSubmit = () => {
    if (selectedInterests.length < 3) {
      setError(t('errors.minInterests'));
      return;
    }
    onNext({ interests: selectedInterests });
  };

  return (
    <StepCard
      icon={Heart}
      title={t('onboarding.steps.interests.title')}
      subtitle={t('onboarding.steps.interests.subtitle')}
      onBack={onBack}
    >
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
          {INTEREST_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {t(`onboarding.steps.interests.categories.${category.name}`)}
              </h3>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {category.interests.map((interest) => {
                  const Icon = interest.icon;
                  const isSelected = selectedInterests.includes(interest.id);
                  
                  return (
                    <MotionCard
                      key={interest.id}
                      variants={item}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleInterest(interest.id)}
                      className={`
                        cursor-pointer p-4 rounded-xl border-2 transition-all
                        ${isSelected 
                          ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-rose-50' 
                          : 'border-amber-100 hover:border-amber-200'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${isSelected
                            ? 'bg-gradient-to-br from-amber-200 to-rose-200'
                            : 'bg-gradient-to-br from-amber-100 to-rose-100'}
                        `}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-700' : 'text-amber-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className={`font-medium text-sm leading-tight line-clamp-2 ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                            {t(`onboarding.steps.interests.options.${interest.id}`)}
                          </p>
                        </div>
                      </div>
                    </MotionCard>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-rose-500 bg-rose-50 p-3 rounded-lg text-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 bg-amber-50/50 p-3 rounded-lg">
          <span>{t('onboarding.steps.interests.selected', { count: selectedInterests.length })}</span>
          <span>{t('onboarding.steps.interests.minimum')}</span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-xl font-medium hover:from-amber-500 hover:to-rose-500 transition-colors"
        >
          {t('onboarding.next')}
        </button>
      </div>
    </StepCard>
  );
}