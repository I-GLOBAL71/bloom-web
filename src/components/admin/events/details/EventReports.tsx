import React from 'react';
import { Flag, MessageCircle, Shield, X } from 'lucide-react';
import { formatRelativeTime } from '../../../../utils/dateUtils';

interface EventReport {
  id: string;
  userId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewing' | 'resolved';
  createdAt: Date;
}

interface EventReportsProps {
  eventId: string;
}

// Mock data for demonstration
const MOCK_REPORTS: EventReport[] = [
  {
    id: '1',
    userId: 'user1',
    reason: 'Inappropriate content',
    details: 'The event description contains offensive language',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    userId: 'user2',
    reason: 'Scam suspicion',
    details: 'The entry fee seems suspicious',
    status: 'reviewing',
    createdAt: new Date(Date.now() - 7200000)
  }
];

export function EventReports({ eventId }: EventReportsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Reports ({MOCK_REPORTS.length})
        </h2>
        <button className="px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 rounded-lg">
          Mark All as Resolved
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_REPORTS.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <Flag className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {report.reason}
                    </h3>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${report.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : report.status === 'reviewing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'}
                    `}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {report.details}
                  </p>
                  <p className="text-xs text-gray-500">
                    Reported {formatRelativeTime(report.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-400 hover:text-pink-500">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-green-600">
                  <Shield className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-rose-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}