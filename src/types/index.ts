export interface User {
  id: string;
  email: string;
  displayName: string;
  name?: string;
  photoURL?: string;
  phoneNumber?: string | null;
  birthDate?: Date;
  gender?: 'rose' | 'bumblebee' | 'garden';
  bio?: string;
  profession?: string;
  interests?: string[];
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
  };
  photos?: string[];
  flowers?: number;
  profileCompleted?: boolean;
  hasCompletedOnboarding?: boolean;
  isPremium?: boolean;
  role?: 'user' | 'admin' | 'superadmin';
  createdAt?: Date;
  updatedAt?: Date;
  isVerified?: boolean;
  education?: string;
  lastActive?: Date;
  personalityFactors?: {
    extroversion: number;
    openness: number;
    conscientiousness: number;
    agreeableness: number;
    emotionalStability: number;
  };
}

export interface ContactRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
  receiverId: string;
  receiverName: string;
  receiverPhotoURL?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
}

export interface EventLocation {
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: Date;
  time?: string;
  location: EventLocation;
  maxParticipants?: number;
  category?: string;
  coverImage?: string;
  entryFee?: number;
  imageUrl?: string;
}

export interface EventParticipant {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  hasCompletedOnboarding: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time?: string;
  location: EventLocation;
  organizerId: string;
  organizerName: string;
  maxParticipants?: number;
  currentParticipants: number;
  participants: EventParticipant[];
  category?: string;
  coverImage?: string;
  imageUrl?: string;
  entryFee?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 
  | 'contact_request'
  | 'event_join'
  | 'match'
  | 'profile_like'
  | 'unread_message';

export interface BaseNotification<T = never> {
  id: string;
  type: NotificationType;
  userId: string;
  read: boolean;
  createdAt: Date;
  data: T;
}

export interface ContactRequestNotificationData {
  requestId: string;
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
}

export interface ContactRequestNotification extends BaseNotification<ContactRequestNotificationData> {
  type: 'contact_request';
  data: {
    requestId: string;
    senderId: string;
    senderName: string;
    senderPhotoURL?: string;
  };
}

export interface EventJoinNotificationData {
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
}

export interface EventJoinNotification extends BaseNotification<EventJoinNotificationData> {
  type: 'event_join';
}

export interface MatchNotificationData {
  matchId: string;
  matchName: string;
  matchPhotoURL?: string;
}

export interface MatchNotification extends BaseNotification<MatchNotificationData> {
  type: 'match';
}

export interface ProfileLikeNotificationData {
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
}

export interface ProfileLikeNotification extends BaseNotification<ProfileLikeNotificationData> {
  type: 'profile_like';
}

export interface MessageNotificationData {
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
  messagePreview?: string;
}

export interface MessageNotification extends BaseNotification<MessageNotificationData> {
  type: 'unread_message';
}

export type Notification =
  | ContactRequestNotification
  | EventJoinNotification
  | MatchNotification
  | ProfileLikeNotification
  | MessageNotification;
