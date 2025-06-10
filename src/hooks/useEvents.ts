import { useState, useEffect } from 'react';
import {
  createEvent,
  joinEvent,
  rateEvent,
  verifyEventQRCode,
  getEvents,
  type EventWithAuth,
  type NewEventWithAuth
} from '../lib/firebase/events';
import { useAuth } from '../contexts/AuthContext';

export function useEvents() {
  const [events, setEvents] = useState<EventWithAuth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsList = await getEvents();
        setEvents(eventsList);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleCreateEvent = async (eventData: Omit<NewEventWithAuth, 'creator'>) => {
    if (!user) throw new Error('Must be logged in to create events');

    const newEvent: NewEventWithAuth = {
      ...eventData,
      creator: {
        id: user.id,
        email: user.email,
        name: user.name || user.displayName || 'Unknown User',
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      }
    };

    const createdEvent = await createEvent(newEvent);
    setEvents(current => [...current, createdEvent]);
    return createdEvent.id;
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) throw new Error('Must be logged in to join events');
    await joinEvent(eventId, user.id);
    // Mettre à jour l'état local
    setEvents(current => 
      current.map(event => 
        event.id === eventId
          ? {
              ...event,
              currentParticipants: event.currentParticipants + 1,
              participants: [...(event.participants || []), user.id]
            }
          : event
      )
    );
  };

  const handleRateEvent = async (eventId: string, rating: number) => {
    if (!user) throw new Error('Must be logged in to rate events');
    await rateEvent(eventId, user.id, rating);
  };

  const handleVerifyQRCode = async (qrCode: string) => {
    return await verifyEventQRCode(qrCode);
  };

  return {
    events,
    loading,
    error,
    createEvent: handleCreateEvent,
    joinEvent: handleJoinEvent,
    rateEvent: handleRateEvent,
    verifyQRCode: handleVerifyQRCode
  };
}

export type { EventWithAuth };