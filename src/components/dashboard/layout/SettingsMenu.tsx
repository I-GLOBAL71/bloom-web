import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  LogOut, 
  User, 
  Bell, 
  Shield, 
  HelpCircle,
  Moon
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const menuItems = [
    { icon: User, label: 'Mon Compte', onClick: () => navigate('/profile') },
    { icon: Bell, label: 'Notifications', onClick: () => {} },
    { icon: Shield, label: 'Confidentialité', onClick: () => {} },
    { icon: Moon, label: 'Mode Sombre', onClick: () => {} },
    { icon: HelpCircle, label: 'Aide', onClick: () => {} },
    { icon: LogOut, label: 'Déconnexion', onClick: handleLogout, className: 'text-red-500 hover:bg-red-50' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                  className={`
                    w-full px-4 py-2 flex items-center gap-3 text-left
                    hover:bg-gray-50 transition-colors
                    ${item.className || 'text-gray-700 hover:text-gray-900'}
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
