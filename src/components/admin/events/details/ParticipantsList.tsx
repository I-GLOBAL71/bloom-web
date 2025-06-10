import React from 'react';
import { MessageCircle, Shield, UserX } from 'lucide-react';
import type { User } from '../../../../types';
import { formatRelativeTime } from '../../../../utils/dateUtils';

interface ParticipantsListProps {
  participants: User[];
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Participants ({participants.length})
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg">
            Remove Selected
          </button>
          <button className="px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 rounded-lg">
            Message All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participants.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.photos[0]}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.location.city}, {user.location.country}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${user.premium
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'}
                  `}>
                    {user.premium ? 'Premium' : 'Free'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatRelativeTime(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-gray-400 hover:text-pink-500">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600">
                      <Shield className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-rose-600">
                      <UserX className="w-4 h-4" />
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