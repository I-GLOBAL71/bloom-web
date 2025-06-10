import React from 'react';
import { 
  Users, Calendar, AlertTriangle, DollarSign,
  TrendingUp, UserPlus, Heart, Clock
} from 'lucide-react';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { RecentActivities } from './RecentActivities';
import { useAdminStats } from '../../../hooks/useAdminStats';

export function AdminDashboard() {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={+12.5}
          color="pink"
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents.toLocaleString()}
          icon={Calendar}
          trend={+8.1}
          color="blue"
        />
        <StatCard
          title="Pending Reports"
          value={stats.pendingReports.toLocaleString()}
          icon={AlertTriangle}
          trend={-5.2}
          color="amber"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={+15.3}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Revenue Overview
          </h2>
          <RevenueChart />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activities
          </h2>
          <RecentActivities />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">User Growth</p>
              <p className="text-2xl font-semibold text-gray-900">+22.5%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Compared to last month
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New Users Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.newUsersToday}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {stats.newUsersToday > 100 ? 'Above' : 'Below'} daily average
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Matches Today</p>
              <p className="text-2xl font-semibold text-gray-900">1,234</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            15% higher than yesterday
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Session</p>
              <p className="text-2xl font-semibold text-gray-900">24m</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            2 minutes longer than last week
          </p>
        </div>
      </div>
    </div>
  );
}