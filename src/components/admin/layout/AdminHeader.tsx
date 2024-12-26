import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAdminAuthStore } from '../store/authStore';

export function AdminHeader() {
  const { logout, user } = useAdminAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="container mx-auto h-full px-6 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
          Bloom Admin
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>

          <motion.button
            className="p-2 hover:bg-gray-100 rounded-full relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <motion.button
            className="p-2 hover:bg-gray-100 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </motion.button>

          <motion.button
            onClick={logout}
            className="p-2 hover:bg-gray-100 rounded-full text-red-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}