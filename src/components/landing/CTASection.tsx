import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { AuthButtons } from '../auth/AuthButtons';

export function CTASection() {
  const { t } = useTranslation('landing');

  return (
    <section className="py-20 bg-gradient-to-br from-pink-500 to-rose-500 relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-white" fill="currentColor" />
            <span className="text-sm font-medium text-white">
              {t('hero.join')}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            {t('hero.ready')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
              Bloomeet
            </span>
          </h2>
          
          <p className="text-lg text-white/90 mb-8">
            {t('hero.cta')}
          </p>
          
          <div className="max-w-lg mx-auto">
            <AuthButtons />
          </div>
        </div>
      </div>
    </section>
  );
}