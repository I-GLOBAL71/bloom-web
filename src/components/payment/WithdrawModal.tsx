import React, { useState } from 'react';
import { Loader2, AlertCircle, Phone } from 'lucide-react';
import { RoseIcon } from '../ui/RoseIcon';
import { createPayout } from '../../lib/payment/api';
import type { User } from '../../types';

interface WithdrawModalProps {
  user: User;
  flowers: number;
  isOpen: boolean;
  onClose: () => void;
}

type TransactionType = 'buy' | 'withdraw';

export function WithdrawModal({ user, flowers, isOpen, onClose }: WithdrawModalProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>('withdraw');
  const [amount, setAmount] = useState(flowers);
  const [operator, setOperator] = useState<'CM_MOMO' | 'CM_OM'>('CM_MOMO');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleTransaction = async () => {
    if (!phoneNumber) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      const response = await createPayout({
        amount: amount * 100, // Conversion en XAF
        reason: transactionType === 'withdraw' 
          ? `Retrait de ${amount} fleurs` 
          : `Achat de ${amount} fleurs`,
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
        setError(response.message || 'La transaction a échoué');
      }
    } catch (err) {
      setError('Échec du traitement de la transaction');
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
            Gestion des fleurs
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
              <p className="font-medium text-gray-900">Retirer des fleurs</p>
              <p className="text-sm text-gray-600">Convertir en argent</p>
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
              <p className="font-medium text-gray-900">Acheter des fleurs</p>
              <p className="text-sm text-gray-600">Avec de l'argent</p>
            </button>
          </div>

          {/* Sélection du Montant */}
          <div>
            <label htmlFor="transaction-amount" className="block text-sm font-medium text-gray-700 mb-2">
              {transactionType === 'withdraw' ? 'Montant à retirer' : 'Montant à acheter'}
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
                <RoseIcon size={16} />
                <span className="text-red-700">fleurs</span>
              </div>
            </div>
            {transactionType === 'withdraw' && (
              <p className="text-sm text-gray-500 mt-1">
                Disponible : {flowers} fleurs
              </p>
            )}
          </div>

          {/* Sélection de l'Opérateur */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de Paiement
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
                <p className="font-medium text-gray-900">MTN Mobile Money</p>
                <p className="text-sm text-gray-600">Transfert instantané</p>
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
                <p className="font-medium text-gray-900">Orange Money</p>
                <p className="text-sm text-gray-600">Transfert instantané</p>
              </label>
            </div>
          </fieldset>

          {/* Numéro de Téléphone */}
          <div>
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Entrez votre numéro de téléphone"
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
              <span className="text-gray-600">Montant</span>
              <span className="font-medium text-gray-900">
                {amount} fleurs = {amount * 100} XAF
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais</span>
              <span className="font-medium text-gray-900">0 XAF</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-medium text-gray-900">{amount * 100} XAF</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              onClick={handleTransaction}
              disabled={loading || amount === 0 || !phoneNumber}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{transactionType === 'withdraw' ? 'Retirer' : 'Acheter'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}