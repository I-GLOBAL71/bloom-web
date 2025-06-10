import React from 'react';
import { useConversationHistory } from '../../hooks/useConversationHistory';
import type { User } from '../../types';
import { MessageCircle, Loader2 } from 'lucide-react';

interface ConversationsListProps {
  onSelectUser: (user: User) => void;
}

export function ConversationsList({ onSelectUser }: ConversationsListProps) {
  const { contactedUsers, loading, error } = useConversationHistory();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-rose-500">
        Une erreur est survenue lors du chargement des conversations
      </div>
    );
  }

  if (!contactedUsers.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
        <p>Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-rose-100">
      {contactedUsers.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className="w-full p-4 flex items-center gap-4 hover:bg-rose-50 transition-colors text-left"
        >
          <div className="relative flex-shrink-0">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name || user.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-rose-600">
                  {(user.name || user.displayName).charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.name || user.displayName}
            </h3>
            {user.location?.city && (
              <p className="text-sm text-gray-500 truncate">
                {user.location.city}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}