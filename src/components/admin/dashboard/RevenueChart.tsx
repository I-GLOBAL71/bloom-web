import React from 'react';
import { useRevenueStats } from '../../../hooks/useRevenueStats';

export function RevenueChart() {
  const { stats, loading, error } = useRevenueStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-rose-500 p-8">
        {error}
      </div>
    );
  }

  // For now, we'll show a placeholder since chart library will be added later
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-3xl font-semibold text-gray-900">
            ${stats.monthly.reduce((acc, m) => acc + m.amount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Total Revenue This Month
          </p>
        </div>

        <select className="px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>

      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
        Revenue Chart Coming Soon
      </div>

      <div className="grid grid-cols-3 gap-6">
        {stats.byProduct.map(product => (
          <div key={product.productId} className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {product.name}
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              ${product.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {product.transactions} transactions
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}