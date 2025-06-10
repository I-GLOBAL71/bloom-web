import React, { useState } from 'react';
import { Shield, AlertCircle, MoreVertical } from 'lucide-react';
import type { Event } from '../../../../types';

interface EventActionsProps {
  event: Event;
  onStatusChange: (status: Event['status']) => Promise<void>;
}

export function EventActions({ event, onStatusChange }: EventActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: Event['status']) => {
    try {
      setLoading(true);
      await onStatusChange(newStatus);
    } catch (error) {
      console.error('Failed to update event status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {event.status === 'upcoming' && (
        <>
          <button
            onClick={() => handleStatusChange('cancelled')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg disabled:opacity-50"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Cancel Event</span>
          </button>

          <button
            onClick={() => handleStatusChange('ongoing')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 rounded-lg disabled:opacity-50"
          >
            <Shield className="w-4 h-4" />
            <span>Start Event</span>
          </button>
        </>
      )}

      {event.status === 'ongoing' && (
        <button
          onClick={() => handleStatusChange('completed')}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 rounded-lg disabled:opacity-50"
        >
          <Shield className="w-4 h-4" />
          <span>Complete Event</span>
        </button>
      )}

      <button className="p-2 text-gray-400 hover:text-gray-900">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}