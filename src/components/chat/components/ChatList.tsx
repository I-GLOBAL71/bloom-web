import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useChatStore } from '../store/chatStore';

export function ChatList() {
  const { conversations, users, activeConversation, setActiveConversation } = useChatStore();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conversation => {
          const otherParticipant = users[conversation.participants.find(id => id !== 'user1') || ''];
          
          return (
            <motion.button
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`w-full p-4 flex items-center gap-4 hover:bg-pink-50 transition-colors ${
                activeConversation === conversation.id ? 'bg-pink-50' : ''
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="relative">
                <img
                  src={otherParticipant?.avatar}
                  alt={otherParticipant?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  otherParticipant?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{otherParticipant?.name}</span>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(conversation.lastMessage.timestamp, {
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
              {conversation.unreadCount > 0 && (
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{conversation.unreadCount}</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}