import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Smile, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Image className="w-5 h-5" />
        </motion.button>
        <motion.button
          type="button"
          className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Smile className="w-5 h-5" />
        </motion.button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('chat.placeholder')}
          className="flex-1 p-2 rounded-full border border-gray-200 focus:outline-none focus:border-pink-500 transition-colors"
        />
        {message.trim() ? (
          <motion.button
            type="submit"
            className="p-2 text-pink-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Mic className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </form>
  );
}