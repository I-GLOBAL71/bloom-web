import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  availableLanguages: { code: string; name: string; nativeName: string; isRTL?: boolean; font?: string }[];
  isCurrentRTL: boolean;
};

const languageList = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true, font: 'var(--font-arabic)' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', font: 'var(--font-chinese)' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', font: 'var(--font-hindi)' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', font: 'var(--font-bengali)' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', font: 'var(--font-russian)' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true, font: 'var(--font-arabic)' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getDefaultLanguage = (): string => {
  // Récupérer la langue sauvegardée
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang && languageList.some(lang => lang.code === savedLang)) {
    return savedLang;
  }

  // Détecter la langue du navigateur
  const browserLang = navigator.language.split('-')[0];
  if (languageList.some(lang => lang.code === browserLang)) {
    return browserLang;
  }

  // Langue par défaut
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getDefaultLanguage());
  const isCurrentRTL = languageList.find(lang => lang.code === currentLanguage)?.isRTL || false;

  const applyLanguageStyles = (lang: string) => {
    const language = languageList.find(l => l.code === lang);
    const isRTL = language?.isRTL || false;
    const font = language?.font;

    // Appliquer la direction RTL/LTR
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Appliquer la police spécifique à la langue si définie
    if (font) {
      document.documentElement.style.setProperty('--font-primary', font);
    } else {
      document.documentElement.style.removeProperty('--font-primary');
    }

    // Ajouter/supprimer la classe RTL pour les styles spécifiques
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
      applyLanguageStyles(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  useEffect(() => {
    // Appliquer les styles initiaux
    applyLanguageStyles(currentLanguage);

    // Nettoyer les styles lors du démontage
    return () => {
      document.documentElement.style.removeProperty('--font-primary');
      document.body.classList.remove('rtl');
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        availableLanguages: languageList,
        isCurrentRTL
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};