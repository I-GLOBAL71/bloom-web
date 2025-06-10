import { create } from 'zustand';
import { Message, Conversation, ChatUser } from '../types';

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Record<string, Message[]>;
  users: Record<string, ChatUser>;
  isTyping: Record<string, boolean>;
}

interface ChatActions {
  setActiveConversation: (id: string | null) => void;
  addMessage: (message: Message) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  markMessageAsRead: (conversationId: string, messageId: string) => void;
  addConversation: (conversation: Conversation) => void;
  updateUser: (user: ChatUser) => void;
}

// Données de test pour le développement
const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['user1', 'user2'],
    lastMessage: {
      id: 'm1',
      conversationId: '1',
      senderId: 'user2',
      content: 'Bonjour ! Comment vas-tu ?',
      type: 'text',
      timestamp: Date.now() - 1000 * 60 * 5,
      status: 'read'
    },
    unreadCount: 0,
    updatedAt: Date.now() - 1000 * 60 * 5,
    type: 'match'
  },
  {
    id: '2',
    participants: ['user1', 'user3'],
    lastMessage: {
      id: 'm2',
      conversationId: '2',
      senderId: 'user3',
      content: 'On se voit demain ?',
      type: 'text',
      timestamp: Date.now() - 1000 * 60 * 30,
      status: 'delivered'
    },
    unreadCount: 1,
    updatedAt: Date.now() - 1000 * 60 * 30,
    type: 'match'
  }
];

const mockUsers: Record<string, ChatUser> = {
  user2: {
    id: 'user2',
    name: 'Sophie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    status: 'online'
  },
  user3: {
    id: 'user3',
    name: 'Marie',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    status: 'offline',
    lastSeen: Date.now() - 1000 * 60 * 15
  }
};

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'user2',
      content: 'Bonjour ! Comment vas-tu ?',
      type: 'text',
      timestamp: Date.now() - 1000 * 60 * 5,
      status: 'read'
    }
  ],
  '2': [
    {
      id: 'm2',
      conversationId: '2',
      senderId: 'user3',
      content: 'On se voit demain ?',
      type: 'text',
      timestamp: Date.now() - 1000 * 60 * 30,
      status: 'delivered'
    }
  ]
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  conversations: mockConversations,
  activeConversation: null,
  messages: mockMessages,
  users: mockUsers,
  isTyping: {},

  setActiveConversation: (id) => 
    set({ activeConversation: id }),

  addMessage: (message) => 
    set((state) => {
      const conversationId = message.conversationId;
      const conversationMessages = state.messages[conversationId] || [];
      
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...conversationMessages, message],
        },
      };
    }),

  setTyping: (userId, isTyping) =>
    set((state) => ({
      isTyping: {
        ...state.isTyping,
        [userId]: isTyping,
      },
    })),

  markMessageAsRead: (conversationId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((msg) =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ),
      },
    })),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),

  updateUser: (user) =>
    set((state) => ({
      users: {
        ...state.users,
        [user.id]: user,
      },
    })),
}));