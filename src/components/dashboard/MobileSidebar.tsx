import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  Crown, 
  Settings,
  User,
  LogOut
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function NavItem({ icon, label, active, onClick, className = '' }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full flex flex-col items-center gap-1 p-3 rounded-2xl
        ${active 
          ? 'bg-gradient-to-r from-amber-400/20 to-pink-500/20 text-pink-600' 
          : 'text-gray-500 hover:bg-pink-50'
        }
        transition-colors
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenChat: () => void;
  onOpenMatches: () => void;
}

export function MobileSidebar({ isOpen, onClose, onLogout, onOpenChat, onOpenMatches }: MobileSidebarProps) {
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <>
      {/* Menu latéral pour les paramètres et la déconnexion */}
      {isOpen && (
        <div className="lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg z-30">
            <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-white">
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
                Bloom
              </div>
            </div>
            <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
              <NavItem
                icon={<Settings className="w-6 h-6" />}
                label="Paramètres"
                onClick={() => {
                  setActiveTab('settings');
                  onClose();
                }}
              />
              <NavItem
                icon={<LogOut className="w-6 h-6" />}
                label="Déconnexion"
                onClick={onLogout}
                className="!text-red-500 hover:!bg-red-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Barre de navigation mobile en bas */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-t border-pink-100 px-4 py-2 lg:hidden"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="grid grid-cols-5 gap-2">
          <NavItem
            icon={<Home className="w-6 h-6" />}
            label="Accueil"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavItem
            icon={<Heart className="w-6 h-6" />}
            label="Matchs"
            active={activeTab === 'matches'}
            onClick={() => {
              setActiveTab('matches');
              onOpenMatches();
            }}
          />
          <NavItem
            icon={<MessageCircle className="w-6 h-6" />}
            label="Messages"
            active={activeTab === 'messages'}
            onClick={() => {
              setActiveTab('messages');
              onOpenChat();
            }}
          />
          <NavItem
            icon={<Crown className="w-6 h-6" />}
            label="Premium"
            active={activeTab === 'premium'}
            onClick={() => setActiveTab('premium')}
          />
          <NavItem
            icon={<User className="w-6 h-6" />}
            label="Profil"
            active={activeTab === 'profile'}
            onClick={() => {
              setActiveTab('profile');
              onClose();
            }}
          />
        </div>
      </motion.div>
    </>
  );
}