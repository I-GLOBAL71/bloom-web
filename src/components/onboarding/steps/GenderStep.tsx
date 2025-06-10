import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepCard } from '../StepCard';
import { GARDEN_IDENTITIES } from '../../../constants/garden';
import { GradientButton } from '../../ui/GradientButton';
import { Leaf } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface GenderStepProps {
  onNext: (data: { gender: string }) => void;
  initialValue: string;
  onBack?: () => void;
}

export function GenderStep({ onNext, initialValue, onBack }: GenderStepProps) {
  const { t, i18n } = useTranslation('onboarding', {
    useSuspense: false
  });
  const { currentLanguage } = useLanguage();
  const isRTL = ['ar', 'ur'].includes(currentLanguage);
  const [isLoading, setIsLoading] = React.useState(true);
  const [translationBundle, setTranslationBundle] = React.useState<any>(null);

  // Debug logging for initial mount
  React.useEffect(() => {
    console.log('GenderStep mounted:', {
      currentLanguage: i18n.language,
      defaultLanguage: i18n.options.fallbackLng,
      hasLoadedNamespace: i18n.hasLoadedNamespace('onboarding'),
      translationTest: {
        title: t('steps.gender.title'),
        titleRaw: i18n.getResource(i18n.language, 'onboarding', 'steps.gender.title'),
        fullResource: i18n.getResourceBundle(i18n.language, 'onboarding')
      }
    });
  }, []);

  // Load translations
  React.useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Wait for i18n to be initialized if it isn't already
        if (!i18n.isInitialized) {
          console.log('Waiting for i18n initialization...');
          await new Promise((resolve) => {
            const checkInit = () => {
              if (i18n.isInitialized) {
                resolve(true);
              } else {
                setTimeout(checkInit, 100);
              }
            };
            checkInit();
          });
        }

        console.log('Starting translation load...', {
          currentLanguage: i18n.language,
          isInitialized: i18n.isInitialized,
          hasLoadedNamespace: i18n.hasLoadedNamespace('onboarding')
        });

        await i18n.loadNamespaces('onboarding');
        const bundle = i18n.getResourceBundle(i18n.language, 'onboarding');
        
        console.log('Translation bundle loaded:', {
          currentLanguage: i18n.language,
          hasLoaded: i18n.hasLoadedNamespace('onboarding'),
          bundleContent: bundle,
          genderTitle: bundle?.steps?.gender?.title,
          genderSubtitle: bundle?.steps?.gender?.subtitle,
          roseLabel: bundle?.steps?.gender?.options?.rose?.label
        });
        
        // Check if we have all required translations
        const hasRequiredTranslations = bundle?.steps?.gender?.title &&
                                      bundle?.steps?.gender?.subtitle &&
                                      bundle?.steps?.gender?.options;
                                      
        if (hasRequiredTranslations) {
          console.log('All required translations found');
          setTranslationBundle(bundle);
          setIsLoading(false);
        } else {
          console.log('Missing required translations');
          // Try loading directly from the JSON
          try {
            const directBundle = await import('../../../i18n/locales/fr/onboarding.json');
            if (directBundle?.steps?.gender) {
              console.log('Loaded translations directly from JSON');
              setTranslationBundle(directBundle);
              setIsLoading(false);
            }
          } catch (importError) {
            console.error('Failed to load translations directly:', importError);
          }
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };
    loadTranslations();
  }, [i18n, i18n.language]);

  // Reset loading state when language changes
  React.useEffect(() => {
    setIsLoading(true);
  }, [i18n.language]);

  if (isLoading || (!translationBundle && !i18n.hasLoadedNamespace('onboarding'))) {
    return (
      <StepCard
        icon={Leaf}
        title="Loading..."
        subtitle=""
        onBack={onBack}
      >
        <div className="space-y-3">
          <div className="animate-pulse h-16 bg-gray-100 rounded-lg" />
          <div className="animate-pulse h-16 bg-gray-100 rounded-lg" />
          <div className="animate-pulse h-16 bg-gray-100 rounded-lg" />
        </div>
      </StepCard>
    );
  }

  const getTranslation = (path: string) => {
    if (translationBundle) {
      // Access nested properties from the bundle
      const value = path.split('.').reduce((obj, key) => obj?.[key], translationBundle as any);
      if (value) return value;
    }
    return t(path, {
      defaultValue: `Missing translation: ${path}`,
      lng: 'fr'
    });
  };

  return (
    <StepCard
      icon={Leaf}
      title={getTranslation('steps.gender.title')}
      subtitle={getTranslation('steps.gender.subtitle')}
      onBack={onBack}
    >
      <div className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
        {GARDEN_IDENTITIES.map(({ id, label, icon: Icon, description }) => (
          <GradientButton
            key={id}
            onClick={() => onNext({ gender: id })}
            variant="secondary"
            fullWidth
            className={`justify-start ${initialValue === id ? 'border-amber-300 bg-amber-50' : ''}`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
              <Icon className="w-6 h-6 text-amber-500" />
            </div>
            <div className={`text-left ${isRTL ? 'mr-4' : 'ml-4'}`}>
              <div className="font-medium text-gray-900">
                {getTranslation(`steps.gender.options.${id}.label`)}
              </div>
              <div className="text-sm text-gray-600">
                {getTranslation(`steps.gender.options.${id}.description`)}
              </div>
            </div>
          </GradientButton>
        ))}
      </div>
    </StepCard>
  );
}