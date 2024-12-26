import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  Crown, 
  Bell,
  User
} from 'lucide-react';
import bloomLogo from '/bloom-logo.svg';

export function DashboardNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={bloomLogo} alt="Bloom Logo" className="h-12 w-auto" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { icon: Home, label: 'Accueil' },
              { icon: Heart, label: 'Matchs' },
              { icon: MessageCircle, label: 'Messages' },
              { icon: Crown, label: 'Premium' }
            ].map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pink-50 text-gray-600 hover:text-pink-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <motion.button
              className="relative p-2 rounded-full hover:bg-pink-50 text-gray-600 hover:text-pink-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full" />
            </motion.button>

            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5" />
              <span>Profil</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}