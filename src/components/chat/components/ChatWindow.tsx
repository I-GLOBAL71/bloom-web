import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useChatStore } from '../store/chatStore';

export function ChatWindow() {
  const { activeConversation, messages, isTyping } = useChatStore();

  return (
    <div className="h-full flex flex-col">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-gray-500 italic"
            >
              En train d'écrire...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ChatInput />
    </div>
  );
}