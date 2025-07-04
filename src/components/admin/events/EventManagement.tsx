import React, { useState } from 'react';
import { Search, Filter, Calendar, AlertCircle } from 'lucide-react';
import { EventsList } from './EventsList';
import { EventFilters } from './EventFilters';
import { useEvents } from '../../../hooks/useEvents';

export function EventManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { events, loading, error } = useEvents();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Event Management
        </h1>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
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
              placeholder="Search events by title, location, or organizer..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {/* Implement bulk cancel */}}
            className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Cancel Selected</span>
          </button>

          <button
            onClick={() => {/* Implement bulk approve */}}
            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 rounded-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>Approve Selected</span>
          </button>
        </div>
      </div>

      {showFilters && <EventFilters onClose={() => setShowFilters(false)} />}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="text-center text-rose-500 p-8">
          {error}
        </div>
      ) : (
        <EventsList events={events} />
      )}
    </div>
  );
}