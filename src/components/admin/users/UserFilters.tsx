import React from 'react';
import { X } from 'lucide-react';

interface UserFiltersProps {
  onClose: () => void;
}

export function UserFilters({ onClose }: UserFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Filter Users
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Status
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200">
            <option value="">All</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200">
            <option value="">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Join Date
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Active
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200">
            <option value="">Any Time</option>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reports
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200">
            <option value="">All</option>
            <option value="reported">Has Reports</option>
            <option value="clean">No Reports</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}