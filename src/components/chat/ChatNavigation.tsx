import React from 'react';
import { ChevronLeft, Phone, Video } from 'lucide-react';
import type { User } from '../../types';

interface ChatNavigationProps {
  recipient: User;
  onBack: () => void;
}

export const ChatNavigation: React.FC<ChatNavigationProps> = ({ recipient, onBack }) => {
  const handleCall = (type: 'audio' | 'video') => {
    console.log(`Initialisation d'un appel ${type} avec ${recipient.name}`);
  };

  return (
    <div className="h-14 border-b bg-white flex items-center px-4 justify-between sticky top-0">
      {/* Bouton retour */}
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="ml-2 text-sm font-medium">Retour aux messages</span>
      </button>

      {/* Actions d'appel */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleCall('audio')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          title="Appel audio"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button 
          onClick={() => handleCall('video')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          title="Appel vidéo"
        >
          <Video className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};