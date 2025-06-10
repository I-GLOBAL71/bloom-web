import type { AuthUser } from '../../types/auth';
import type { EventLocation } from '../../types';

interface EventWithAuth {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: EventLocation;
  coverImage?: string;
  imageUrl: string;
  maxParticipants: number;
  participants?: string[];
  currentParticipants: number;
  entryFee?: number;
  price: number;
  organizer?: AuthUser;
  creator: AuthUser;
  status?: 'upcoming' | 'past' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

type NewEventWithAuth = Omit<EventWithAuth, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'currentParticipants' | 'price' | 'participants'>;

export const createEvent = async (event: NewEventWithAuth): Promise<EventWithAuth> => {
  // Simuler la création d'un événement avec les timestamps
  const now = new Date();
  const newEvent: EventWithAuth = {
    ...event,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: now,
    updatedAt: now,
    participants: [],
    currentParticipants: 0,
    imageUrl: event.coverImage || '',
    price: event.entryFee || 0,
    status: 'upcoming'
  };
  return newEvent;
};

export const getEvents = async (): Promise<EventWithAuth[]> => {
  // TODO: Implémenter la récupération des événements depuis Firebase
  return [];
};

export const joinEvent = async (eventId: string, userId: string): Promise<void> => {
  // TODO: Implement event join logic using eventId and userId
  console.log('Event join not implemented yet', { eventId, userId });
};

export const leaveEvent = async (eventId: string, userId: string): Promise<void> => {
  // TODO: Implement event leave logic using eventId and userId
  console.log('Event leave not implemented yet', { eventId, userId });
};

export const isEventParticipant = async (eventId: string, userId: string): Promise<boolean> => {
  // TODO: Implement participant check logic using eventId and userId
  console.log('Event participant check not implemented yet', { eventId, userId });
  return false;
};

export const rateEvent = async (eventId: string, userId: string, rating: number): Promise<void> => {
  // TODO: Implémenter la logique pour noter un événement
  console.log(`Rating event ${eventId} with ${rating} stars by user ${userId}`);
};

export const verifyEventQRCode = async (qrCode: string): Promise<EventWithAuth | null> => {
  // TODO: Implémenter la vérification du QR code
  console.log(`Verifying QR code: ${qrCode}`);
  return null;
};

export type { EventWithAuth, NewEventWithAuth };