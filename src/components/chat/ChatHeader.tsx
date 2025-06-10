import React from 'react';
import { Clock, Calendar, Plus } from 'lucide-react';
import type { User } from '../../types';
import { formatLastActive } from '../../utils/dateUtils';
import { ContactRequestButton } from './ContactRequestButton';

interface ChatHeaderProps {
  recipient: User;
  onCreateEvent?: () => void;
}

export function ChatHeader({ recipient, onCreateEvent }: ChatHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 p-4 relative z-50">
      <div className="flex items-center gap-3">
        <img
          src={recipient.photos?.[0] || recipient.photoURL}
          alt={recipient.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{recipient.name}</h2>
          <p className="text-sm text-gray-500">
            {recipient.location?.city && recipient.location?.country ? (
              <>
                {recipient.location.city}, {recipient.location.country}
              </>
            ) : (
              "Localisation non disponible"
            )}
            {recipient.lastActive && (
              <span className="inline-flex items-center ml-2 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {formatLastActive(recipient.lastActive)}
              </span>
            )}
          </p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateEvent}
              className="p-2 text-gray-500 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50 group"
              title="Proposer un événement"
            >
              <Calendar className="w-5 h-5" />
              <Plus className="w-3 h-3 absolute -right-1 -bottom-1 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <ContactRequestButton recipient={recipient} />
          </div>
        </div>
      </div>
    </div>
  );
}