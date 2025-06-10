import React from 'react';
import { 
  UserPlus, Heart, Calendar, Shield, 
  AlertTriangle, DollarSign 
} from 'lucide-react';
import { formatRelativeTime } from '../../../utils/dateUtils';

const activities = [
  {
    id: '1',
    type: 'new_user',
    icon: UserPlus,
    color: 'text-blue-500 bg-blue-100',
    content: 'New user registered',
    details: 'Sophie, 28 from Paris',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: '2',
    type: 'match',
    icon: Heart,
    color: 'text-pink-500 bg-pink-100',
    content: 'New match created',
    details: 'Alex and Emma',
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: '3',
    type: 'event',
    icon: Calendar,
    color: 'text-purple-500 bg-purple-100',
    content: 'New event created',
    details: 'Garden Party & Wine Tasting',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '4',
    type: 'report',
    icon: AlertTriangle,
    color: 'text-amber-500 bg-amber-100',
    content: 'New user report',
    details: 'Inappropriate content',
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  },
  {
    id: '5',
    type: 'verification',
    icon: Shield,
    color: 'text-green-500 bg-green-100',
    content: 'Profile verified',
    details: 'Manual verification by admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  },
  {
    id: '6',
    type: 'payment',
    icon: DollarSign,
    color: 'text-emerald-500 bg-emerald-100',
    content: 'Premium subscription',
    details: '$29.99 monthly plan',
    timestamp: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
  }
];

export function RecentActivities() {
  return (
    <div className="space-y-6">
      {activities.map(({ id, type, icon: Icon, color, content, details, timestamp }) => (
        <div key={id} className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {content}
            </p>
            <p className="text-sm text-gray-600">
              {details}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatRelativeTime(timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}