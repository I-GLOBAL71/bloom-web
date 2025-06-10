export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support';
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  pendingReports: number;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  details: string;
  evidence?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedBy?: string;
  resolution?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: 'user' | 'event' | 'report' | 'system';
  targetId: string;
  details: string;
  timestamp: Date;
  ip: string;
}

export interface RevenueStats {
  daily: {
    date: string;
    amount: number;
    transactions: number;
  }[];
  monthly: {
    month: string;
    amount: number;
    transactions: number;
  }[];
  byProduct: {
    productId: string;
    name: string;
    amount: number;
    transactions: number;
  }[];
}