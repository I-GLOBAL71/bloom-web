import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bell } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    type: 'match' | 'message' | 'like';
    message: string;
  } | null;
  onClose: () => void;
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  if (!notification) return null;

  const icons = {
    match: Heart,
    message: MessageCircle,
    like: Bell
  };

  const Icon = icons[notification.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-full">
            <Icon className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-sm font-medium">{notification.message}</p>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}