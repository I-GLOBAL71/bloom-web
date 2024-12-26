import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function MessagesSection() {
  const conversations = [
    {
      id: '1',
      name: 'Sophie',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      lastMessage: 'Bonjour ! Comment vas-tu ?',
      timestamp: '10:30',
      unread: 2
    },
    {
      id: '2',
      name: 'Marie',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      lastMessage: 'On se voit demain ?',
      timestamp: 'Hier',
      unread: 0
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MessageCircle className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Messages</h1>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {conversations.map(conversation => (
          <motion.div
            key={conversation.id}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <img
                src={conversation.photo}
                alt={conversation.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {conversation.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{conversation.name}</h3>
                <span className="text-sm text-gray-500">{conversation.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
