import React from 'react';
import { Calendar, MapPin, Users, Wallet, MoreVertical, Shield, AlertCircle } from 'lucide-react';
import type { Event } from '../../../types';
import { formatEventDate } from '../../../utils/dateUtils';

interface EventsListProps {
  events: Event[];
}

export function EventsList({ events }: EventsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${event.status === 'upcoming'
                      ? 'bg-green-100 text-green-700'
                      : event.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-gray-100 text-gray-700'}
                  `}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {event.location.address}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.location.city}, {event.location.country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatEventDate(event.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.participants.length}
                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {/* View details */}}
                      className="p-1 text-gray-400 hover:text-gray-900"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* Approve event */}}
                      className="p-1 text-gray-400 hover:text-green-600"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* Cancel event */}}
                      className="p-1 text-gray-400 hover:text-rose-600"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-900">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}