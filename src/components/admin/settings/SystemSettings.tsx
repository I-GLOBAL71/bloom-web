import React from 'react';
import { PaymentGatewaySettings } from './PaymentGatewaySettings';
import { SecuritySettings } from '../../settings/SecuritySettings';
import { GeneralSettings } from './GeneralSettings';

export function SystemSettings() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        System Settings
      </h1>
      
      <PaymentGatewaySettings />
      <SecuritySettings />
      <GeneralSettings />
    </div>
  );
}
