import React from 'react';
import { CurrencySettings } from './CurrencySettings';
import { TransactionHistory } from './TransactionHistory';
import { CommissionSettings } from './CommissionSettings';

export function CurrencyManagement() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Currency Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CurrencySettings />
        <CommissionSettings />
      </div>

      <TransactionHistory />
    </div>
  );
}