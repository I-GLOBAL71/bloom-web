import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useProfile } from '../../../hooks/useProfile';
import { SettingsMenu } from './SettingsMenu';
import { logger } from '../../../utils/logger';

export function Header() {
  const { profile } = useProfile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    logger.info('Header', 'Component mounted', {
      timestamp: new Date().toISOString()
    });

    return () => {
      logger.info('Header', 'Component unmounted', {
        timestamp: new Date().toISOString()
      });
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
      <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/bloom-logo.svg" alt="Bloom" className="h-8 w-auto" />
        </div>

        {/* Right section: Profile & Settings */}
        <div className="flex items-center gap-4">
          {/* Profile Photo */}
          {profile?.photoURL && (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={profile.photoURL}
                alt={profile.displayName || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Settings Button */}
          <div className="relative">
            <button 
              className={`
                p-2 rounded-full transition-colors
                ${isSettingsOpen 
                  ? 'bg-pink-50 text-pink-500' 
                  : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
                }
              `}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings className="w-5 h-5" />
            </button>

            <SettingsMenu 
              isOpen={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
