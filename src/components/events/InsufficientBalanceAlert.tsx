import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InsufficientBalanceAlertProps {
  required: number;
  balance: number;
  onRecharge: () => void;
}

export function InsufficientBalanceAlert({ required, balance, onRecharge }: InsufficientBalanceAlertProps) {
  const { t } = useTranslation('events');
  const missing = required - balance;

  return (
    <div className="flex items-start gap-3 text-sm bg-rose-50 p-3 rounded-lg">
      <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <p className="text-rose-700">
          {t('createEvent.errors.firstContributor', { missing, required })}
        </p>
        <button
          type="button"
          onClick={onRecharge}
          className="text-rose-600 hover:text-rose-700 font-medium"
        >
          {t('createEvent.errors.recharge')}
        </button>
      </div>
    </div>
  );
}