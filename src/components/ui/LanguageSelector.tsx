import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languageNames = {
  en: { name: 'English', nativeName: 'English' },
  fr: { name: 'French', nativeName: 'Français' },
  ar: { name: 'Arabic', nativeName: 'العربية' },
  zh: { name: 'Chinese', nativeName: '中文' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  es: { name: 'Spanish', nativeName: 'Español' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  it: { name: 'Italian', nativeName: 'Italiano' },
  de: { name: 'German', nativeName: 'Deutsch' }
};

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation('common');
  const isCurrentRTL = ['ar', 'ur'].includes(currentLanguage);

  return (
    <div className="relative inline-block">
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className={`
            appearance-none bg-white border border-gray-300 rounded-lg
            py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2
            focus:ring-amber-500 focus:border-amber-500 transition-colors
            ${isCurrentRTL ? 'text-right' : 'text-left'}
          `}
          aria-label={t('common.language')}
          style={{ direction: isCurrentRTL ? 'rtl' : 'ltr' }}
        >
          {Object.entries(languageNames).map(([code, { name, nativeName }]) => {
            const isRTL = ['ar', 'ur'].includes(code);
            return (
              <option
                key={code}
                value={code}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: isRTL ? 'var(--font-arabic)' : 'inherit'
                }}
              >
                {nativeName} {/* Afficher seulement le nom natif pour une meilleure expérience utilisateur */}
              </option>
            );
          })}
        </select>
        <div 
          className={`
            pointer-events-none absolute inset-y-0 flex items-center px-2 text-gray-700
            ${isCurrentRTL ? 'left-0' : 'right-0'}
          `}
        >
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;