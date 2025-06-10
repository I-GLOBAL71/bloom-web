import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, Users, X } from 'lucide-react';
import { RoseIcon } from '../ui/RoseIcon';
import { GradientButton } from '../ui/GradientButton';
import type { CreateEventData, EventLocation } from '../../types';
import { ImageUpload } from './ImageUpload';
import { LocationInput } from '../shared/LocationInput';
import { checkUserBalance, processEventContribution } from '../../lib/firebase/payments';
import { FlowersModal } from '../payment/FlowersModal';
import { InsufficientBalanceAlert } from './InsufficientBalanceAlert';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: CreateEventData) => Promise<string>;
}

export function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
  const { t } = useTranslation('events');
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    date: new Date(),
    time: '',
    location: {
      address: '',
      city: '',
      latitude: 0,
      longitude: 0,
      country: ''
    },
    coverImage: undefined
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const loadUserBalance = async () => {
        try {
          const balance = await checkUserBalance(user.id);
          setUserBalance(balance);
        } catch (err) {
          console.error('Erreur lors du chargement du solde:', err);
        }
      };
      loadUserBalance();
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        throw new Error('Vous devez être connecté pour créer un événement');
      }

      if (!formData.entryFee) {
        throw new Error('Les frais d\'entrée sont requis');
      }

      if (userBalance < formData.entryFee) {
        throw new Error(`Solde insuffisant. Vous avez ${userBalance} fleurs, l'événement requiert ${formData.entryFee} fleurs.`);
      }

      setLoading(true);
      setError('');
      
      const eventId = await onSubmit(formData);
      await processEventContribution(user.id, eventId, formData.entryFee);
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'La création de l\'événement a échoué. Veuillez réessayer.');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
         onClick={(e) => {
           if (e.target === e.currentTarget) onClose();
         }}>
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-2xl">
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {t('createEvent.title')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white transition-colors"
                type="button"
                aria-label={t('createEvent.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 pb-6">
              <p className="text-white text-sm leading-relaxed font-medium">
                {t('createEvent.intro')}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.title.label')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.coverImage.label')}
              </label>
              <ImageUpload
                currentImage={formData.coverImage}
                onChange={(imageUrl) => setFormData(prev => ({ ...prev, coverImage: imageUrl }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.description.label')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createEvent.form.date.label')}
                </label>
                <input
                  type="date"
                  value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createEvent.form.time.label')}
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.location.label')}
              </label>
              <LocationInput
                initialAddress={formData.location.address}
                onLocationSelect={(location) => {
                  setFormData(prev => ({
                    ...prev,
                    location: {
                      address: location.address,
                      city: location.city,
                      latitude: location.latitude,
                      longitude: location.longitude,
                      country: location.country
                    }
                  }))
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createEvent.form.maxParticipants.label')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxParticipants || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    maxParticipants: parseInt(e.target.value) || undefined
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createEvent.form.entryFee.label')}
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.entryFee || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      entryFee: parseInt(e.target.value) || undefined
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                    required
                  />
                  <p className="text-sm text-gray-500 flex items-center">
                    <RoseIcon size={16} className="mr-1" />
                    <span className="text-red-700">
                      {t('createEvent.form.balance', { balance: userBalance })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-rose-500">{error}</p>
          )}
        </form>

        {formData.entryFee && formData.entryFee > userBalance && (
          <div className="bg-rose-50 border-t border-rose-100">
            <div className="max-w-screen-sm mx-auto py-4 px-6">
              <InsufficientBalanceAlert
                required={formData.entryFee}
                balance={userBalance}
                onRecharge={() => setShowBuyModal(true)}
              />
            </div>
          </div>
        )}

        <div className="p-6 border-t border-pink-100 bg-white">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('createEvent.actions.cancel')}
            </button>
            <GradientButton
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t('createEvent.actions.creating') : t('createEvent.actions.create')}
            </GradientButton>
          </div>
        </div>

        {showBuyModal && user && (
          <FlowersModal
            user={user}
            flowers={userBalance}
            isOpen={showBuyModal}
            onClose={() => {
              setShowBuyModal(false);
              if (user) {
                checkUserBalance(user.id).then(balance => setUserBalance(balance));
              }
            }}
          />
        )}
      </div>
    </div>
  );
}