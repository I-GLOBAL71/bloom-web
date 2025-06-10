import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, MessageCircle, User } from 'lucide-react';

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
  }
];

export function MobileNavbar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => (
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
  );
}