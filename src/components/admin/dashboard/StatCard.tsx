import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: number;
  color: 'pink' | 'blue' | 'amber' | 'green';
}

const colorClasses = {
  pink: {
    bg: 'bg-pink-50',
    icon: 'text-pink-500',
    trend: {
      positive: 'text-pink-700 bg-pink-100',
      negative: 'text-rose-700 bg-rose-100'
    }
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    trend: {
      positive: 'text-blue-700 bg-blue-100',
      negative: 'text-rose-700 bg-rose-100'
    }
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    trend: {
      positive: 'text-amber-700 bg-amber-100',
      negative: 'text-rose-700 bg-rose-100'
    }
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-500',
    trend: {
      positive: 'text-green-700 bg-green-100',
      negative: 'text-rose-700 bg-rose-100'
    }
  }
};

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = colorClasses[color];
  const isPositive = trend >= 0;

  return (
    <div className={`${colors.bg} rounded-xl p-6`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>

        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-full text-sm
          ${isPositive ? colors.trend.positive : colors.trend.negative}
        `}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
}
