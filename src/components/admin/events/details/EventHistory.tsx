import React from 'react';
import { History, Shield, AlertCircle, MessageCircle } from 'lucide-react';
import { formatRelativeTime } from '../../../../utils/dateUtils';

interface EventHistoryEntry {
  id: string;
  type: 'status_change' | 'participant_joined' | 'participant_left' | 'report' | 'moderation';
  details: string;
  userId?: string;
  createdAt: Date;
}

interface EventHistoryProps {
  eventId: string;
}

// Mock data for demonstration
const MOCK_HISTORY: EventHistoryEntry[] = [
  {
    id: '1',
    type: 'status_change',
    details: 'Event status changed from draft to upcoming',
    userId: 'admin1',
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    type: 'participant_joined',
    details: 'New participant joined the event',
    userId: 'user1',
    createdAt: new Date(Date.now() - 7200000)
  },
  {
    id: '3',
    type: 'report',
    details: 'Event reported for inappropriate content',
    userId: 'user2',
    createdAt: new Date(Date.now() - 10800000)
  }
];

const getEntryIcon = (type: EventHistoryEntry['type']) => {
  switch (type) {
    case 'status_change':
      return Shield;
    case 'participant_joined':
    case 'participant_left':
      return History;
    case 'report':
      return AlertCircle;
    case 'moderation':
      return MessageCircle;
    default:
      return History;
  }
};

const getEntryColor = (type: EventHistoryEntry['type']) => {
  switch (type) {
    case 'status_change':
      return 'text-green-500 bg-green-50';
    case 'participant_joined':
      return 'text-blue-500 bg-blue-50';
    case 'participant_left':
      return 'text-gray-500 bg-gray-50';
    case 'report':
      return 'text-rose-500 bg-rose-50';
    case 'moderation':
      return 'text-amber-500 bg-amber-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
};

export function EventHistory({ eventId }: EventHistoryProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">
        Event History
      </h2>

      <div className="space-y-4">
        {MOCK_HISTORY.map((entry) => {
          const Icon = getEntryIcon(entry.type);
          const colorClass = getEntryColor(entry.type);

          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {entry.details}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatRelativeTime(entry.createdAt)}
                  {entry.userId && (
                    <> by <span className="font-medium">{entry.userId}</span></>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}