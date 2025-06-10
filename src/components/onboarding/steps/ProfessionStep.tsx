import React, { useState, useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../contexts/LanguageContext';
import { StepCard } from '../StepCard';
import { PROFESSION_CATEGORIES } from '../../../constants/professions';
import { motion } from 'framer-motion';

interface ProfessionStepProps {
  onNext: (data: { profession: string }) => void;
  initialValue: string;
  onBack?: () => void;
}

const MotionCard = motion.div;

export function ProfessionStep({ onNext, initialValue, onBack }: ProfessionStepProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [selectedProfession, setSelectedProfession] = useState(initialValue);
  const [customProfession, setCustomProfession] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = ['ar', 'ur'].includes(currentLanguage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfession && !customProfession.trim()) {
      setError(t('errors.professionRequired'));
      return;
    }
    
    onNext({ profession: selectedProfession || customProfession });
  };

  return (
    <StepCard
      icon={Briefcase}
      title={t('onboarding.steps.profession.title')}
      subtitle={t('onboarding.steps.profession.subtitle')}
      onBack={onBack}
    >
      <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="space-y-4">
          <div 
            ref={containerRef}
            className="max-h-[400px] overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent"
          >
            {PROFESSION_CATEGORIES.map((category) => (
              <div key={category.name}>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {t(`onboarding.steps.profession.categories.${category.name}`)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.professions.map((profession) => {
                    const Icon = profession.icon;
                    return (
                      <MotionCard
                        key={profession.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedProfession(profession.id);
                          setCustomProfession('');
                          setError('');
                        }}
                        className={`
                          cursor-pointer p-4 rounded-xl border-2 transition-colors
                          ${selectedProfession === profession.id
                            ? 'border-amber-300 bg-amber-50'
                            : 'border-amber-100 hover:border-amber-200'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                              {t(`onboarding.steps.profession.options.${profession.id}`)}
                            </p>
                          </div>
                        </div>
                      </MotionCard>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t('onboarding.steps.profession.orCustom')}
              </span>
            </div>
          </div>

          <input
            type="text"
            value={customProfession}
            onChange={(e) => {
              setCustomProfession(e.target.value);
              setSelectedProfession('');
              setError('');
            }}
            placeholder={t('onboarding.steps.profession.placeholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-colors"
          />

          {error && (
            <p className="mt-2 text-sm text-rose-500 text-center">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-xl font-medium hover:from-amber-500 hover:to-rose-500 transition-colors"
        >
          {t('onboarding.next')}
        </button>
      </form>
    </StepCard>
  );
}