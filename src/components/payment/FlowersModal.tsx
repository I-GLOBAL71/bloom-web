import React, { useState } from 'react';
import { Loader2, AlertCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createPayout } from '../../lib/payment/api';
import { RoseIcon } from '../ui/RoseIcon';
import type { User } from '../../types';

interface FlowersModalProps {
  user: User;
  flowers: number;
  isOpen: boolean;
  onClose: () => void;
}

type TransactionType = 'buy' | 'withdraw';

export function FlowersModal({ user, flowers, isOpen, onClose }: FlowersModalProps) {
  const { t } = useTranslation('payment');
  const [transactionType, setTransactionType] = useState<TransactionType>('withdraw');
  const [amount, setAmount] = useState(flowers);
  const [operator, setOperator] = useState<'CM_MOMO' | 'CM_OM'>('CM_MOMO');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleTransaction = async () => {
    if (!phoneNumber) {
      setError(t('flowers.modal.errors.phoneRequired'));
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      const response = await createPayout({
        amount: amount * 100, // Conversion en XAF
        reason: transactionType === 'withdraw' 
          ? t('flowers.modal.summary.withdraw', { count: amount })
          : t('flowers.modal.summary.buy', { count: amount }),
        operator,
        customerName: user.name,
        customerPhone: phoneNumber,
        customerEmail: '', // À récupérer du profil utilisateur
        reference: `${transactionType.toUpperCase()}_${Date.now()}`
      });

      if (response.status === 'success') {
        onClose();
        // TODO: Mettre à jour le solde de fleurs de l'utilisateur
      } else {
        setError(t('flowers.modal.errors.failed'));
      }
    } catch (err) {
      setError(t('flowers.modal.errors.processingError'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg my-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('flowers.modal.title')}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Type de Transaction */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTransactionType('withdraw')}
              className={`
                p-4 rounded-lg border-2 transition-colors text-left
                ${transactionType === 'withdraw'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-200'}
              `}
            >
              <p className="font-medium text-gray-900">{t('flowers.modal.withdraw.title')}</p>
              <p className="text-sm text-gray-600">{t('flowers.modal.withdraw.description')}</p>
            </button>
            <button
              onClick={() => setTransactionType('buy')}
              className={`
                p-4 rounded-lg border-2 transition-colors text-left
                ${transactionType === 'buy'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-200'}
              `}
            >
              <p className="font-medium text-gray-900">{t('flowers.modal.buy.title')}</p>
              <p className="text-sm text-gray-600">{t('flowers.modal.buy.description')}</p>
            </button>
          </div>

          {/* Sélection du Montant */}
          <div>
            <label htmlFor="transaction-amount" className="block text-sm font-medium text-gray-700 mb-2">
              {t(`flowers.modal.amount.${transactionType}`)}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="transaction-amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (transactionType === 'withdraw') {
                    setAmount(Math.min(flowers, Math.max(0, value)));
                  } else {
                    setAmount(Math.max(0, value));
                  }
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
              <div className="flex items-center gap-1 text-gray-600">
                <RoseIcon size={20} />
                <span>{t('flowers.modal.amount.unit')}</span>
              </div>
            </div>
            {transactionType === 'withdraw' && (
              <p className="text-sm text-gray-500 mt-1">
                {t('flowers.modal.amount.available', { count: flowers })}
              </p>
            )}
          </div>

          {/* Sélection de l'Opérateur */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              {t('flowers.modal.payment.method')}
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <label
                htmlFor="mtn-momo"
                className={`
                  p-4 rounded-lg border transition-colors text-left cursor-pointer
                  ${operator === 'CM_MOMO'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-200'}
                `}
              >
                <input
                  type="radio"
                  id="mtn-momo"
                  name="payment-method"
                  value="CM_MOMO"
                  checked={operator === 'CM_MOMO'}
                  onChange={(e) => setOperator(e.target.value as 'CM_MOMO' | 'CM_OM')}
                  className="sr-only"
                />
                <p className="font-medium text-gray-900">{t('flowers.modal.payment.momo.title')}</p>
                <p className="text-sm text-gray-600">{t('flowers.modal.payment.momo.description')}</p>
              </label>

              <label
                htmlFor="orange-money"
                className={`
                  p-4 rounded-lg border transition-colors text-left cursor-pointer
                  ${operator === 'CM_OM'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-200'}
                `}
              >
                <input
                  type="radio"
                  id="orange-money"
                  name="payment-method"
                  value="CM_OM"
                  checked={operator === 'CM_OM'}
                  onChange={(e) => setOperator(e.target.value as 'CM_MOMO' | 'CM_OM')}
                  className="sr-only"
                />
                <p className="font-medium text-gray-900">{t('flowers.modal.payment.om.title')}</p>
                <p className="text-sm text-gray-600">{t('flowers.modal.payment.om.description')}</p>
              </label>
            </div>
          </fieldset>

          {/* Numéro de Téléphone */}
          <div>
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-2">
              {t('flowers.modal.phone.label')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder={t('flowers.modal.phone.placeholder')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Résumé */}
          <div className="p-4 rounded-lg bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('flowers.modal.summary.amount')}</span>
              <span className="font-medium text-gray-900">
                {t('flowers.modal.summary.conversion', { flowers: amount, amount: amount * 100 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('flowers.modal.summary.fees')}</span>
              <span className="font-medium text-gray-900">{t('flowers.modal.summary.freeAmount')}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between">
              <span className="font-medium text-gray-900">{t('flowers.modal.summary.total')}</span>
              <span className="font-medium text-gray-900">
                {t('flowers.modal.summary.conversion', { flowers: amount, amount: amount * 100 })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              {t('flowers.modal.actions.cancel')}
            </button>
            <button
              onClick={handleTransaction}
              disabled={loading || amount === 0 || !phoneNumber}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {t(`flowers.modal.actions.${transactionType}`)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}