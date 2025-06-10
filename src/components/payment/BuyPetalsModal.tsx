import React, { useState } from 'react';
import { Leaf, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PETAL_PACKAGES } from '../../lib/payment/config';
import { createPayment } from '../../lib/payment/api';
import type { User } from '../../types';

interface BuyPetalsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyPetalsModal({ user, isOpen, onClose }: BuyPetalsModalProps) {
  const { t } = useTranslation('payment');
  const [selectedPackage, setSelectedPackage] = useState<typeof PETAL_PACKAGES[number]>(PETAL_PACKAGES[1]); // Popular package by default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handlePurchase = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await createPayment({
        amount: selectedPackage.price,
        reason: `Purchase ${selectedPackage.petals} petals`,
        customerName: user.name,
        customerPhone: '', // Get from user profile
        customerEmail: '', // Get from user profile
        reference: `PETALS_${Date.now()}`
      });

      if (response.status === 'success' && response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setError(t('petals.modal.errors.failed'));
      }
    } catch (err) {
      setError(t('petals.modal.errors.processingError'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg my-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('petals.modal.title')}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Package Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PETAL_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`
                  p-4 rounded-xl border-2 transition-colors text-left
                  ${selectedPackage.id === pkg.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-200'}
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className={`w-5 h-5 ${
                    selectedPackage.id === pkg.id ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900">
                    {t('petals.modal.packageLabel', { count: pkg.petals })}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {t('petals.modal.price', { amount: pkg.price })}
                </p>
                {pkg.amount !== pkg.petals && (
                  <p className="text-sm text-pink-600 mt-1">
                    {t('petals.modal.bonus', { count: pkg.petals - pkg.amount })}
                  </p>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              {t('petals.modal.cancel')}
            </button>
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{t('petals.modal.purchase')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}