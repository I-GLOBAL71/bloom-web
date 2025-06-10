import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  Crown,
  User
} from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore';
import { useTranslation } from 'react-i18next';

interface NavItemProps {
  icon: React.ComponentType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl w-full
        ${active 
          ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-lg' 
          : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

export function DashboardNavbar() {
  const { t } = useTranslation();
  const { activeSection, setActiveSection } = useNavigationStore();

  const navItems = [
    { id: 'home', icon: Home, label: t('navigation.home') },
    { id: 'matches', icon: Heart, label: t('navigation.matches') },
    { id: 'messages', icon: MessageCircle, label: t('navigation.messages') },
    { id: 'premium', icon: Crown, label: t('navigation.premium') },
    { id: 'profile', icon: User, label: t('navigation.profile') }
  ];

  return (
    <nav className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-pink-100 p-4">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => setActiveSection(item.id as any)}
          />
        ))}
      </div>
    </nav>
  );
}