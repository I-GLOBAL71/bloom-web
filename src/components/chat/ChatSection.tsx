import React, { useState, useEffect } from 'react';
import { useMatches } from '../../hooks/useMatches';
import { useChat } from '../../hooks/useChat';
import { useProfile } from '../../hooks/useProfile';
import { Match, Message } from '../../lib/models/user';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatSectionProps {
  onClose?: () => void;
}

export function ChatSection({ onClose }: ChatSectionProps) {
  const { t } = useTranslation();
  const { matches, loading: matchesLoading } = useMatches();
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const { messages, sendMessage } = useChat(activeMatch?.id || '');
  const { profile } = useProfile();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeMatch) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (matchesLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-pink-500" />
          {t('navigation.messages')}
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
                className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setActiveMatch(match)}
              >
                <div className="relative">
                  <img
                    src={match.users[0] === profile?.id ? match.users[1].photoURL : match.users[0].photoURL}
                    alt={match.users[0] === profile?.id ? match.users[1].displayName : match.users[0].displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {match.lastMessage && match.lastMessage.senderId !== profile?.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">
                      {match.users[0] === profile?.id ? match.users[1].displayName : match.users[0].displayName}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {match.lastMessage ? match.lastMessage.timestamp : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {match.lastMessage ? match.lastMessage.text : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Aucune conversation pour le moment.<br />
              Commencez à discuter avec vos matchs !
            </p>
          </div>
        )}
      </div>

      {activeMatch && (
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {activeMatch.users[0] === profile?.id 
                ? activeMatch.users[1].displayName 
                : activeMatch.users[0].displayName}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.senderId === profile?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.senderId === profile?.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                className="p-2 hover:bg-pink-50 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image className="w-5 h-5 text-gray-400" />
              </motion.button>
              <motion.button
                type="button"
                className="p-2 hover:bg-pink-50 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Smile className="w-5 h-5 text-gray-400" />
              </motion.button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 p-2 border rounded-full focus:outline-none focus:border-pink-500"
              />
              <motion.button
                type="submit"
                className="p-2 bg-pink-500 text-white rounded-full disabled:opacity-50"
                disabled={!newMessage.trim()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}