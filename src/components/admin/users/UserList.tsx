import React from 'react';
import { MoreVertical, Shield, UserX, Eye } from 'lucide-react';
import type { User } from '../../../types';
import { formatRelativeTime } from '../../../utils/dateUtils';

interface UserListProps {
  users: User[];
  onBanUser: (userId: string) => Promise<void>;
  onVerifyUser: (userId: string) => Promise<void>;
}

export function UserList({ users, onBanUser, onVerifyUser }: UserListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.photos?.[0] || '/default-avatar.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${user.isPremium
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'}
                  `}>
                    {user.isPremium ? 'Premium' : 'Free'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.location?.city || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.location?.country || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive instanceof Date ? formatRelativeTime(user.lastActive) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {/* View profile */}}
                      className="p-1 text-gray-400 hover:text-gray-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onVerifyUser(user.id)}
                      className="p-1 text-gray-400 hover:text-green-600"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onBanUser(user.id)}
                      className="p-1 text-gray-400 hover:text-rose-600"
                    >
                      <UserX className="w-4 h-4" />
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