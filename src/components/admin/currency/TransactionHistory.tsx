import React, { useState } from 'react';
import { 
  Flower, Leaf, Calendar, Download, Search,
  TrendingUp, TrendingDown 
} from 'lucide-react';
import { formatRelativeTime } from '../../../utils/dateUtils';

interface Transaction {
  id: string;
  type: 'petal_purchase' | 'flower_conversion' | 'commission' | 'event_fee';
  amount: number;
  currency: 'petal' | 'flower';
  userId: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

// Mock data for demonstration
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'petal_purchase',
    amount: 100,
    currency: 'petal',
    userId: 'user1',
    description: 'Purchased 100 petals',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    type: 'flower_conversion',
    amount: 1,
    currency: 'flower',
    userId: 'user2',
    description: 'Converted 100 petals to 1 flower',
    status: 'completed',
    createdAt: new Date(Date.now() - 7200000)
  },
  {
    id: '3',
    type: 'commission',
    amount: 5,
    currency: 'petal',
    userId: 'user3',
    description: 'Commission from event entry',
    status: 'completed',
    createdAt: new Date(Date.now() - 10800000)
  }
];

export function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting transactions...');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
            >
              <option value="all">All Types</option>
              <option value="petal_purchase">Petal Purchases</option>
              <option value="flower_conversion">Flower Conversions</option>
              <option value="commission">Commissions</option>
              <option value="event_fee">Event Fees</option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions by ID or user..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {MOCK_TRANSACTIONS.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {transaction.currency === 'petal' ? (
                        <Leaf className="w-4 h-4 text-pink-500" />
                      ) : (
                        <Flower className="w-4 h-4 text-pink-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {transaction.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {transaction.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {transaction.type === 'petal_purchase' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.amount} {transaction.currency}s
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {transaction.userId}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${transaction.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : transaction.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'}
                  `}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatRelativeTime(transaction.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}