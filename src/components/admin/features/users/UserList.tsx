import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Shield, Ban } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export function UserList() {
  const { users } = useUserStore();

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dernière Activité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Matchs
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pétales
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: '#fafafa' }}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                    user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {user.lastActive}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {user.matches}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {user.credits}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <motion.button
                    className="text-yellow-600 hover:text-yellow-900"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Shield className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="text-red-600 hover:text-red-900"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Ban className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="text-gray-400 hover:text-gray-900"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}