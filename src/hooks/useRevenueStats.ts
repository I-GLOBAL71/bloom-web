import { useState, useEffect } from 'react';
import type { RevenueStats } from '../types/admin';

export function useRevenueStats() {
  const [stats, setStats] = useState<RevenueStats>({
    daily: [],
    monthly: [],
    byProduct: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock data for now
        setStats({
          daily: [
            { date: '2024-02-11', amount: 1234, transactions: 45 },
            { date: '2024-02-12', amount: 2345, transactions: 67 }
          ],
          monthly: [
            { month: '2024-01', amount: 45678, transactions: 789 },
            { month: '2024-02', amount: 56789, transactions: 890 }
          ],
          byProduct: [
            { 
              productId: 'premium_monthly',
              name: 'Premium Monthly',
              amount: 34567,
              transactions: 456
            },
            {
              productId: 'petals_pack_100',
              name: 'Petals Pack (100)',
              amount: 12345,
              transactions: 234
            },
            {
              productId: 'event_tickets',
              name: 'Event Tickets',
              amount: 6789,
              transactions: 123
            }
          ]
        });
      } catch (err) {
        console.error('Error fetching revenue stats:', err);
        setError('Failed to load revenue statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}