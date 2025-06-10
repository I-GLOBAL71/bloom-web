import React from 'react';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';
import { SecuritySettings } from './SecuritySettings';
import { PaymentSettings } from './PaymentSettings';
import type { User } from '../../types';

interface UserSettingsProps {
  user: User;
}

export function UserSettings({ user }: UserSettingsProps) {
  return (
    <div className="space-y-6">
      <NotificationSettings />
      <PrivacySettings />
      <SecuritySettings />
      <PaymentSettings />
    </div>
  );
}