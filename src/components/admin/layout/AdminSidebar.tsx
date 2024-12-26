import React from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';
import { AdminSidebarItem } from './AdminSidebarItem';
import { getMenuItems } from '../utils/menuItems';

export function AdminSidebar() {
  const { setActiveSection, activeSectionId } = useAdminStore();
  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <AdminSidebarItem
              key={item.id}
              {...item}
              isActive={activeSectionId === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}