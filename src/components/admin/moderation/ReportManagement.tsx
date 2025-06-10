import React from 'react';

export function ReportManagement() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Report Management</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">No reports found</p>
          <p className="text-sm text-gray-600">All reports have been resolved</p>
        </div>
      </div>
    </div>
  );
}
