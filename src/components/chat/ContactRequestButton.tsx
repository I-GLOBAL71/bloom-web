import React, { useState } from 'react';
import { UserPlus, Loader2, Heart } from 'lucide-react';
import type { AuthUser } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import { sendContactRequest } from '../../lib/firebase/contacts';
import { toast } from 'react-hot-toast';

interface ContactRequestButtonProps {
  recipient: AuthUser;
}

export function ContactRequestButton({ recipient }: ContactRequestButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRequest = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour envoyer une demande de contact');
      return;
    }

    try {
      setIsLoading(true);
      
      await sendContactRequest({
        senderId: user.id,
        senderName: user.name || user.displayName || 'Utilisateur',
        senderPhotoURL: user.photoURL || '',
        recipientId: recipient.id,
        recipientName: recipient.name || recipient.displayName || 'Utilisateur',
        recipientPhotoURL: recipient.photoURL || ''
      });

      setShowSuccess(true);
      toast.success(`Demande de contact envoyée à ${recipient.name || recipient.displayName}!`, {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 3000,
      });

      setTimeout(() => {
        setShowSuccess(false);
        setShowConfirm(false);
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50"
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        title="Envoyer une demande de contact"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
      </button>

      {showConfirm && (
        <div className="fixed sm:absolute right-0 sm:right-0 left-0 sm:left-auto bottom-0 sm:top-full sm:mt-2 p-4 bg-white rounded-t-xl sm:rounded-lg shadow-lg border border-pink-100 w-full sm:w-80 z-[60]">
          {showSuccess ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-green-500" fill="currentColor" />
              </div>
              <p className="text-green-600 font-medium">Demande de contact envoyée !</p>
            </div>
          ) : (
            <>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Envoyer une demande de contact ?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                {recipient.name || recipient.displayName} sera notifié(e) de votre demande.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setShowConfirm(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-md hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
                  onClick={handleRequest}
                  disabled={isLoading}
                >
                  Envoyer la demande
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}