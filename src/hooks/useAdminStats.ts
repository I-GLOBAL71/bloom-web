import { useState, useEffect } from 'react';
import type { AdminStats } from '../types/admin';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalRevenue: 0,
    pendingReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock data for now
        setStats({
          totalUsers: 15234,
          activeUsers: 8456,
          newUsersToday: 127,
          totalEvents: 234,
          activeEvents: 45,
          totalRevenue: 45678,
          pendingReports: 12
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}