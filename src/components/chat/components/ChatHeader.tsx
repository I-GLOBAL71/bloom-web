import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Phone, Video } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-white/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src="https://ui-avatars.com/api/?name=Sophie&background=random"
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div>
          <h3 className="font-semibold">Sophie</h3>
          <span className="text-sm text-green-500">En ligne</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          className="p-2 hover:bg-gray-100 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Phone className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          className="p-2 hover:bg-gray-100 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Video className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          className="p-2 hover:bg-gray-100 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>
    </div>
  );
}