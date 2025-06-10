import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export function StepCard({ icon: Icon, title, subtitle, onBack, children }: StepCardProps) {
  const { t } = useTranslation('onboarding');
  const { currentLanguage } = useLanguage();
  const isRTL = ['ar', 'ur'].includes(currentLanguage);

  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-xl border-2 border-amber-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-full relative mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 p-2 text-gray-500 hover:text-amber-500 transition-colors flex items-center gap-2`}
          >
            {isRTL ? (
              <>
                {t('back')}
                <span className="rtl-arrow">→</span>
              </>
            ) : (
              <>
                <span className="ltr-arrow">←</span>
                {t('back')}
              </>
            )}
          </button>
        )}
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}