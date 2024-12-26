import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home,
  Heart,
  MessageCircle,
  User,
  Crown,
  Settings,
  LogOut,
  Flower
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  credits: number;
}

const navigationItems = [
  {
    path: 'home',
    icon: Home,
    label: 'Accueil',
    activeColor: 'text-pink-500'
  },
  {
    path: 'matches',
    icon: Heart,
    label: 'Matchs',
    activeColor: 'text-pink-500'
  },
  {
    path: 'messages',
    icon: MessageCircle,
    label: 'Messages',
    activeColor: 'text-blue-500'
  },
  {
    path: 'profile',
    icon: User,
    label: 'Profil',
    activeColor: 'text-purple-500'
  },
  {
    path: 'premium',
    icon: Crown,
    label: 'Premium',
    activeColor: 'text-yellow-500'
  },
  {
    path: 'settings',
    icon: Settings,
    label: 'Paramètres',
    activeColor: 'text-gray-500'
  }
];

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export function Sidebar({ onLogout, credits }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed top-16 left-0">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? `bg-gray-50 ${item.activeColor} font-medium`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? item.activeColor : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <motion.div
            className="mx-2 p-3 rounded-xl bg-gradient-to-br from-amber-100 to-pink-100 flex flex-col items-center gap-1 cursor-pointer"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Flower className="w-6 h-6 text-pink-500" />
            <span className="text-xs font-medium">{credits} crédits</span>
          </motion.div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navigationItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 ${
                  isActive ? item.activeColor : 'text-gray-400'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}