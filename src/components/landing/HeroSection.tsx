import React from 'react';
import { Flower, Heart, Users, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthButtons } from '../auth/AuthButtons';

export function HeroSection() {
  const { t } = useTranslation('landing');

  const handleNavigation = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-pink-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgyMTcsIDcwLCAxMjAsIDAuMSkiLz48L3N2Zz4=')] opacity-40" />
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                Bloomeet
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-sm">
                <Users className="w-8 h-8 text-rose-500 mb-2" />
                <span className="font-bold text-2xl text-gray-900">10k+</span>
                <span className="text-sm text-gray-600">{t('stats.users')}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-sm">
                <Heart className="w-8 h-8 text-rose-500 mb-2" />
                <span className="font-bold text-2xl text-gray-900">5k+</span>
                <span className="text-sm text-gray-600">{t('stats.matches')}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-sm">
                <Flower className="w-8 h-8 text-rose-500 mb-2" />
                <span className="font-bold text-2xl text-gray-900">500+</span>
                <span className="text-sm text-gray-600">{t('stats.events')}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-sm">
                <Gift className="w-8 h-8 text-rose-500 mb-2" />
                <span className="font-bold text-2xl text-gray-900">15k+</span>
                <span className="text-sm text-gray-600">{t('stats.gifts')}</span>
              </div>
            </div>

            <div className="mt-8">
              <AuthButtons />
            </div>
            
            <button
              onClick={handleNavigation}
              className="mt-8 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {t('hero.learnMore')} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}