import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LocationInput } from '../shared/LocationInput';
import { EventLocation, LocationInputProps } from '@/types';
import { createEvent, EventWithAuth, NewEventWithAuth } from '@/lib/firebase/events';
import { checkUserBalance } from '@/lib/firebase/users';
import { useAuth } from '@/contexts/AuthContext';

type NewEvent = NewEventWithAuth;

interface CreateEventModalProps {
  onClose: () => void;
  onEventCreated: (event: EventWithAuth) => void;
}

export function CreateEventModal({ onClose, onEventCreated }: CreateEventModalProps) {
  const { t } = useTranslation('events');
  const { user } = useAuth();
  const [eventType, setEventType] = useState<'free' | 'paid'>('free');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState<EventLocation>({
    address: '',
    city: '',
    coordinates: { lat: 0, lng: 0 }
  });
  const [maxParticipants, setMaxParticipants] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  const loadUserBalance = async () => {
    if (user) {
      try {
        const balance = await checkUserBalance(user.id);
        setUserBalance(balance);
      } catch (err) {
        console.error('Erreur lors du chargement du solde:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newEvent: NewEventWithAuth = {
        title,
        description,
        date: new Date(`${date}T${time}`),
        location,
        maxParticipants: parseInt(maxParticipants, 10),
        coverImage: imageUrl,
        entryFee: eventType === 'paid' ? price : 0,
        creator: user,
        organizer: user
      };

      const createdEvent = await createEvent(newEvent);
      onEventCreated(createdEvent);
      onClose();
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-pink-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('createEvent.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('createEvent.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="space-y-4">
            {/* Event Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('createEvent.eventType.label')}
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setEventType('free')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    eventType === 'free'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      eventType === 'free' ? 'border-pink-500' : 'border-gray-300'
                    }`}>
                      {eventType === 'free' && <Check className="w-3 h-3 text-pink-500" />}
                    </div>
                    <span className="font-medium">{t('createEvent.eventType.free.title')}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('createEvent.eventType.free.description')}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setEventType('paid')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    eventType === 'paid'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      eventType === 'paid' ? 'border-pink-500' : 'border-gray-300'
                    }`}>
                      {eventType === 'paid' && <Check className="w-3 h-3 text-pink-500" />}
                    </div>
                    <span className="font-medium">{t('createEvent.eventType.paid.title')}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('createEvent.eventType.paid.description')}
                  </p>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.title.label')}
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.coverImage.label')}
              </label>
              <button onClick={() => {}}>
                {t('createEvent.form.coverImage.upload')}
              </button>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.description.label')}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createEvent.form.date.label')}
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createEvent.form.time.label')}
                </label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createEvent.form.location.label')}
              </label>
              <LocationInput
                initialAddress=""
                onLocationSelect={setLocation}
              />
            </div>

            {/* Max Participants and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createEvent.form.maxParticipants.label')}
                </label>
                <input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>
              {eventType === 'paid' && (
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('createEvent.form.price.label')}
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-pink-100 bg-white rounded-b-2xl">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('createEvent.actions.cancel')}
            </button>
            <button 
              type="submit"
              onClick={handleSubmit}
              className="rounded-lg font-medium transition-all duration-200 disabled:opacity-50 px-4 py-2 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 text-white hover:from-amber-500 hover:via-rose-500 hover:to-amber-500 hover:shadow-lg"
            >
              {t('createEvent.actions.create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}