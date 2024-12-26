import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCreditStore } from './store/creditStore';

export function TransactionHistory() {
  const { transactions } = useCreditStore();

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6">Historique des transactions</h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className={`
                p-2 rounded-full
                ${transaction.type === 'purchase' 
                  ? 'bg-green-100' 
                  : transaction.type === 'reward'
                  ? 'bg-amber-100'
                  : 'bg-red-100'
                }
              `}>
                {transaction.type === 'purchase' ? (
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                ) : transaction.type === 'reward' ? (
                  <Gift className="w-5 h-5 text-amber-600" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {format(transaction.timestamp, 'PPP à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
            <div className={`
              font-bold
              ${transaction.type === 'purchase' || transaction.type === 'reward'
                ? 'text-green-600'
                : 'text-red-600'
              }
            `}>
              {transaction.type === 'spent' ? '-' : '+'}
              {Math.abs(transaction.amount)} pétales
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}