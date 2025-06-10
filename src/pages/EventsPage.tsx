import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useEvents, type EventWithAuth } from '../hooks/useEvents';
import type { CreateEventData } from '../types';
import { EventCard } from '../components/events/EventCard';
import { CreateEventModal } from '../components/events/CreateEventModal.new';

export function EventsPage() {
  const { t } = useTranslation('events');
  const { events, loading, error, joinEvent, createEvent } = useEvents();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleCreateEvent = async (eventData: CreateEventData): Promise<string> => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    const newEventData = {
      ...eventData,
      maxParticipants: eventData.maxParticipants || 10,
      entryFee: eventData.entryFee || 0
    };

    return await createEvent(newEventData);
  };

  return (
    <div className="relative">
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-32 right-6 w-14 h-14 md:w-auto md:h-auto md:px-6 md:py-3 bg-pink-500 text-white rounded-full shadow-xl hover:bg-pink-600 hover:shadow-2xl transition-all duration-300 flex items-center justify-center md:justify-start space-x-0 md:space-x-2 z-[9999]"
      >
        <span className="text-2xl">+</span>
        <span className="hidden md:inline">{t('createEvent.button')}</span>
      </button>

      <div className="min-h-screen bg-gray-50 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 px-2">
            {t('title')}
          </h1>
          
          {events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">{t('noEvents')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {events.map((event: EventWithAuth) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onJoin={joinEvent}
                  isParticipant={event.participants?.includes(user?.id || '')}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEvent}
        />
      )}
    </div>
  );
}

export default EventsPage;