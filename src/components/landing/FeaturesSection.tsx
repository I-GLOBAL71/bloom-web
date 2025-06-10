import React from 'react';
import { useTranslation } from 'react-i18next';
import { GradientCard } from '../ui/GradientCard';
import {
  Sparkles, MessageCircleHeart, Calendar, Gift,
  Shield, Globe, Crown, Heart
} from 'lucide-react';

export function FeaturesSection() {
  const { t } = useTranslation('landing');

  const features = [
    {
      icon: MessageCircleHeart,
      key: 'messaging'
    },
    {
      icon: Calendar,
      key: 'events'
    },
    {
      icon: Gift,
      key: 'rewards'
    },
    {
      icon: Shield,
      key: 'security'
    },
    {
      icon: Globe,
      key: 'community'
    },
    {
      icon: Crown,
      key: 'premium'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium">
              <span>Why Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                Bloomeet
              </span>
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.subtitle')}
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Discover what makes{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
              Bloomeet
            </span>{' '}
            special
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, key }) => (
            <GradientCard key={key} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`features.items.${key}.description`)}
                  </p>
                </div>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>
    </section>
  );
}