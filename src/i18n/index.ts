import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
<<<<<<< HEAD

// Fonction pour gérer la direction du texte
const setDocumentDirection = (language: string) => {
  const rtlLanguages = ['ar', 'ur'];
  document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
};

// Import all locale files (including nested directories)
const locales = import.meta.glob('./locales/**/*.json', { eager: true });

// Create resources object from imported locales
const resources = Object.entries(locales).reduce((acc, [path, module]) => {
  console.log('Processing translation file:', {
    path,
    content: module
  });
  
  const matches = path.match(/\.\/locales\/(\w+)\/([^.]+)\.json/);
  if (matches) {
    const [, lang, namespace] = matches;
    console.log('Parsed file info:', { lang, namespace });
    
    if (!acc[lang]) {
      acc[lang] = {};
    }
    if (!acc[lang][namespace]) {
      acc[lang][namespace] = {};
    }
    
    const translations = module as any;
    console.log(`Adding translations for ${lang}/${namespace}:`, translations);
    
    acc[lang][namespace] = {
      ...acc[lang][namespace],
      ...translations
    };
  }
  return acc;
}, {} as Record<string, Record<string, any>>);

// Log final resources structure
console.log('Final i18n resources:', JSON.stringify(resources, null, 2));

const initI18n = async () => {
  try {
    console.log('Initializing i18n with resources:', {
      languages: Object.keys(resources),
      frenchNamespaces: resources.fr ? Object.keys(resources.fr) : [],
      onboardingContent: resources.fr?.onboarding
    });

    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        lng: 'fr', // Force French language for testing
        fallbackLng: 'en',
        defaultNS: ['common', 'onboarding'],
        ns: ['common', 'onboarding', 'landing', 'dashboard', 'auth', 'profile', 'events'],
        supportedLngs: [
          'en', 'en-US', 'en-GB',
          'fr', 'fr-FR', 'fr-CA',
          'es', 'es-ES', 'es-MX',
          'zh', 'zh-CN', 'zh-TW',
          'ar', 'ar-SA',
          'hi', 'hi-IN',
          'bn', 'bn-BD',
          'pt', 'pt-BR', 'pt-PT',
          'ru', 'ru-RU',
          'ur', 'ur-PK',
          'it', 'it-IT',
          'de', 'de-DE'
        ],
        load: 'languageOnly',
        debug: true,
        interpolation: {
          escapeValue: false,
        },
        returnObjects: true,
        nonExplicitSupportedLngs: true,
        detection: {
          order: ['navigator', 'querystring', 'localStorage', 'sessionStorage', 'htmlTag'],
          caches: ['localStorage', 'sessionStorage'],
          lookupQuerystring: 'lng',
          lookupCookie: 'i18next',
          lookupLocalStorage: 'i18nextLng',
          lookupSessionStorage: 'i18nextLng',
          htmlTag: document.documentElement
        },
        resources,
      });

    console.log('i18n initialization successful:', {
      currentLanguage: i18n.language,
      availableResources: Object.keys(resources).reduce((acc, lang) => ({
        ...acc,
        [lang]: Object.keys(resources[lang])
      }), {})
    });

    // Écouter les changements de langue et mettre à jour la direction du document
    i18n.on('languageChanged', (lng) => {
      setDocumentDirection(lng);
    });

    // Définir la direction initiale
    setDocumentDirection(i18n.language);
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    throw error;
  }
};

// Initialize i18n
initI18n();
=======
import { en } from './locales/en';
import { fr } from './locales/fr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      fr: {
        translation: fr
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678

export default i18n;