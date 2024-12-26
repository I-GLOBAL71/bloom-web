import React from 'react';
import { UserManagement } from '../features/users/UserManagement';
import { CreditManagement } from '../features/credits/CreditManagement';

interface AdminContentProps {
  sectionId: string;
}

export function AdminContent({ sectionId }: AdminContentProps) {
  switch (sectionId) {
    case 'users':
      return <UserManagement />;
    case 'credits':
      return <CreditManagement />;
    case 'messages':
      return <div>Gestion des Messages</div>;
    case 'moderation':
      return <div>Modération</div>;
    case 'stats':
      return <div>Statistiques</div>;
    case 'settings':
      return <div>Paramètres</div>;
    default:
      return <UserManagement />;
  }
}