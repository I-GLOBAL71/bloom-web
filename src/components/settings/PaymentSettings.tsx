import React, { useState } from 'react';
import { CreditCard, Trash2, Plus, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money';
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

type PaymentMethodType = PaymentMethod['type'];

export function PaymentSettings() {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expiryDate: '12/24',
      isDefault: true
    },
    {
      id: '2',
      type: 'mobile_money',
      last4: '1234',
      isDefault: false
    }
  ]);

  const handleSetDefault = async (methodId: string) => {
    setPaymentMethods((prev: PaymentMethod[]) =>
      prev.map((method: PaymentMethod) => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const handleDelete = async (methodId: string) => {
    setPaymentMethods((prev: PaymentMethod[]) =>
      prev.filter((method: PaymentMethod) => method.id !== methodId)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{t('profile.settings.payment.methods.title')}</h2>
          <p className="text-sm text-gray-600">{t('profile.settings.payment.methods.description')}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
          <Plus className="w-4 h-4" />
          <span>{t('profile.settings.payment.methods.addNew')}</span>
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method: PaymentMethod) => (
          <div
            key={method.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {t(`profile.settings.payment.methods.types.${method.type}`)} •••• {method.last4}
                </p>
                {method.expiryDate && (
                  <p className="text-sm text-gray-600">
                    {t('profile.settings.payment.methods.expires', { date: method.expiryDate })}
                  </p>
                )}
              </div>
              {method.isDefault && (
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  {t('profile.settings.payment.methods.default')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!method.isDefault && (
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  {t('profile.settings.payment.methods.setDefault')}
                </button>
              )}
              <button
                onClick={() => handleDelete(method.id)}
                className="p-1 text-gray-400 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          {t('profile.settings.payment.history.title')}
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('profile.settings.payment.history.date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('profile.settings.payment.history.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('profile.settings.payment.history.status')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Mar 1, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $29.99
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    {t('profile.settings.payment.history.statuses.paid')}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Feb 1, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $29.99
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    {t('profile.settings.payment.history.statuses.paid')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}