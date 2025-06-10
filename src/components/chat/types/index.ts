export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: number;
  type: 'match' | 'temporary';
  expiresAt?: number;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: number;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
}