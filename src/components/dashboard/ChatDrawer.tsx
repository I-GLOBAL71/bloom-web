import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Image, Smile } from 'lucide-react';

export function ChatDrawer() {
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Sophie',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      lastMessage: 'Bonjour ! Comment vas-tu ?',
      timestamp: '10:30',
      unread: 2
    },
    // Add more conversations
  ];

  return (
    <motion.div
      className="w-96 bg-white/80 backdrop-blur-md shadow-lg flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-pink-500" />
          Messages
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversations.map(conversation => (
          <motion.div
            key={conversation.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer relative"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={conversation.photo}
              alt={conversation.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium">{conversation.name}</h3>
              <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{conversation.timestamp}</p>
              {conversation.unread > 0 && (
                <span className="bg-pink-500 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">
                  {conversation.unread}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 hover:bg-pink-50 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            className="p-2 hover:bg-pink-50 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Smile className="w-5 h-5 text-gray-400" />
          </motion.button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:border-pink-500"
          />
          <motion.button
            className="p-2 bg-pink-500 text-white rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}