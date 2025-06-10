import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          <span className="text-xl font-semibold text-gray-900">Admin</span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-700">
            Production
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="h-8 w-px bg-gray-200" />
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">
                Super Admin
              </p>
            </div>
            
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}