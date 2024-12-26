import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  Settings, 
  LogOut,
  Crown
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  onOpenChat: () => void;
  onOpenMatches: () => void;
}

export function Sidebar({ onLogout, onOpenChat, onOpenMatches }: SidebarProps) {
  return (
    <div className="w-20 bg-white/80 backdrop-blur-md shadow-lg flex flex-col items-center py-8">
      <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent mb-12">
        B
      </div>

      <nav className="flex-1 flex flex-col items-center gap-8">
        <motion.button
          className="p-3 rounded-xl bg-pink-50 text-pink-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={onOpenMatches}
          className="p-3 rounded-xl hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={onOpenChat}
          className="p-3 rounded-xl hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>

        <motion.button
          className="p-3 rounded-xl hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-6 h-6" />
        </motion.button>

        <motion.button
          className="p-3 rounded-xl hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Crown className="w-6 h-6" />
        </motion.button>
      </nav>

      <motion.button
        onClick={onLogout}
        className="mt-auto p-3 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <LogOut className="w-6 h-6" />
      </motion.button>
    </div>
  );
}