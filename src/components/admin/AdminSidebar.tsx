import React from 'react';
import { 
  LayoutDashboard, Users, Calendar, Shield, 
  DollarSign, Settings, ClipboardList, Flower
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'reports', label: 'Moderation', icon: Shield },
  { id: 'currency', label: 'Currency', icon: Flower },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList }
];

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen pt-16">
      <nav className="p-4 space-y-1">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`
              w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm
              ${activeSection === id
                ? 'bg-pink-50 text-pink-700 font-medium'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}