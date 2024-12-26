import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MatchesSectionProps {
  onClose?: () => void;
}

export function MatchesSection({ onClose }: MatchesSectionProps) {
  const { t } = useTranslation();
  const matches = [
    {
      id: '1',
      name: 'Sophie',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      lastActive: '5 min',
      compatibility: 85
    },
    {
      id: '2',
      name: 'Marie',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      lastActive: '1 h',
      compatibility: 92
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          {t('navigation.matches')}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map(match => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
              >
                <img
                  src={match.photo}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{match.name}</h3>
                  <p className="text-sm text-gray-500">
                    Actif il y a {match.lastActive}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-pink-500">
                    {match.compatibility}% compatible
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Vous n'avez pas encore de matchs.<br />
              Continuez à swiper pour en trouver !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}