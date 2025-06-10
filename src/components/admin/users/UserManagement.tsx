import React, { useState } from 'react';
import { Search, Filter, Download, UserX, Shield } from 'lucide-react';
import { UserList } from './UserList';
import { UserFilters } from './UserFilters';
import { useUsers } from '../../../hooks/useUsers';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { users, loading, error, banUser, verifyUser } = useUsers();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
  };

  const handleExport = () => {
    // Implement CSV export
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          User Management
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form 
          onSubmit={handleSearch}
          className="flex-1"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email, or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {/* Implement bulk ban */}}
            className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg"
          >
            <UserX className="w-4 h-4" />
            <span>Bulk Ban</span>
          </button>

          <button
            onClick={() => {/* Implement bulk verify */}}
            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 rounded-lg"
          >
            <Shield className="w-4 h-4" />
            <span>Bulk Verify</span>
          </button>
        </div>
      </div>

      {showFilters && <UserFilters onClose={() => setShowFilters(false)} />}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="text-center text-rose-500 p-8">
          {error?.message || 'Une erreur est survenue lors du chargement des utilisateurs'}
        </div>
      ) : (
        <UserList 
          users={users}
          onBanUser={banUser}
          onVerifyUser={verifyUser}
        />
      )}
    </div>
  );
}