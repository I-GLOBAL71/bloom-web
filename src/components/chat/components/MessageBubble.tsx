import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <motion.div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`max-w-[70%] ${
          isOwn
            ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white'
            : 'bg-white'
        } rounded-2xl px-4 py-2 shadow-md`}
      >
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center gap-1 text-xs mt-1 ${
          isOwn ? 'text-white/80' : 'text-gray-500'
        }`}>
          <span>
            {format(message.timestamp, 'HH:mm', { locale: fr })}
          </span>
          {isOwn && (
            message.status === 'read' ? (
              <CheckCheck className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}