import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationBadgeProps {
  onClick?: () => void;
  className?: string;
  asButton?: boolean;
}

export function NotificationBadge({ onClick, className = '', asButton = true }: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  const content = (
    <>
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-pink-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </>
  );

  const commonClasses = `relative p-2 text-gray-600 hover:text-pink-500 transition-colors ${className}`;

  if (asButton) {
    return (
      <button 
        onClick={onClick}
        className={commonClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={commonClasses}>
      {content}
    </div>
  );
}