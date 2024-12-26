import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';

export function TransactionHistory() {
  const transactions = [
    {
      id: '1',
      user: 'Sophie Martin',
      type: 'purchase',
      amount: 500,
      price: '9.99€',
      date: '2024-03-16 14:30'
    },
    // Ajoutez plus de transactions ici
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Historique des Transactions</h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          
          <motion.button
            className="p-2 hover:bg-gray-100 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pétales
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <motion.tr
              key={transaction.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: '#fafafa' }}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${transaction.user}&background=random`}
                    alt={transaction.user}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="ml-4">{transaction.user}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {transaction.type === 'purchase' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  {transaction.type}
                </div>
              </td>
              <td className="px-6 py-4">
                {transaction.amount}
              </td>
              <td className="px-6 py-4">
                {transaction.price}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {transaction.date}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}