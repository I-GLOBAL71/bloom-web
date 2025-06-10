import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { EventWithAuth } from '@/lib/firebase/events';
import type { AuthUser } from '@/types/auth';
import { checkUserBalance, updateUserBalance } from '@/lib/firebase/users';
import { QRCodeGenerator } from './QRCodeGenerator';

interface EventPaymentModalProps {
  event: EventWithAuth;
  user: AuthUser;
  onClose: () => void;
  onPaymentComplete: () => void;
}

export function EventPaymentModal({ event, user, onClose, onPaymentComplete }: EventPaymentModalProps) {
  const { t } = useTranslation('events');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Vérifier le solde de l'utilisateur
      const balance = await checkUserBalance(user.id);
      if (balance < event.price) {
        setError(t('payment.insufficientBalance'));
        return;
      }

      // Générer un ID unique pour le paiement
      const paymentId = `${event.id}-${user.id}-${Date.now()}`;
      
      // Déduire les fleurs du compte de l'utilisateur
      await updateUserBalance(user.id, -event.price);
      
      // Sauvegarder le paymentId pour le QR code
      setPaymentId(paymentId);
      setShowQRCode(true);
      onPaymentComplete();

    } catch (err) {
      console.error('Erreur lors du paiement:', err);
      setError(t('payment.error'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-pink-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {showQRCode ? t('payment.qrCode.title') : t('payment.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!showQRCode ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">{t('payment.eventPrice')}</p>
                <p className="text-2xl font-semibold text-gray-900">{event.price} fleurs</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full rounded-lg font-medium transition-all duration-200 disabled:opacity-50 px-4 py-3 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 text-white hover:from-amber-500 hover:via-rose-500 hover:to-amber-500 hover:shadow-lg"
              >
                {processing ? t('payment.processing') : t('payment.confirm')}
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <p className="text-gray-600">{t('payment.qrCode.description')}</p>
              </div>
              {paymentId && (
                <div className="flex justify-center">
                  <QRCodeGenerator 
                    codeData={{
                      eventId: event.id,
                      userId: user.id,
                      paymentId: paymentId,
                      timestamp: Date.now()
                    }}
                  />
                </div>
              )}
              <p className="mt-4 text-sm text-gray-500">
                {t('payment.qrCode.instruction')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}