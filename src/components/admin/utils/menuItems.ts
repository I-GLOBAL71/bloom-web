import { 
  Users, 
  MessageSquare, 
  CreditCard, 
  Shield, 
  BarChart2,
  Settings
} from 'lucide-react';

export function getMenuItems() {
  return [
    { id: 'users', icon: Users, label: 'Utilisateurs' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'credits', icon: CreditCard, label: 'Crédits' },
    { id: 'moderation', icon: Shield, label: 'Modération' },
    { id: 'stats', icon: BarChart2, label: 'Statistiques' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
  ];
}