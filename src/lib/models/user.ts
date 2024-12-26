import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string;
  bio: string;
  birthDate: Timestamp;
  gender: 'male' | 'female' | 'other';
  location: {
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  interests: string[];
  photos: string[];
  premium: boolean;
  premiumUntil?: Timestamp;
  credits: number;
  settings: {
    maxDistance: number;
    ageRange: {
      min: number;
      max: number;
    };
    showMe: 'male' | 'female' | 'all';
    notifications: {
      matches: boolean;
      messages: boolean;
      likes: boolean;
    };
  };
  stats: {
    matches: number;
    views: number;
    superLikes: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Match {
  id: string;
  users: [string, string];
  timestamp: Timestamp;
  lastMessage?: {
    text: string;
    timestamp: Timestamp;
    senderId: string;
  };
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface SwipeAction {
  id: string;
  userId: string;
  targetUserId: string;
  action: 'like' | 'superlike' | 'pass';
  timestamp: Timestamp;
}
