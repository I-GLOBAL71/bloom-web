import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation } from '../types';
import { collection, query, where, getDocs, addDoc, doc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useSocket } from './useSocket';

interface UseChatReturn {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
  markAsRead: (messageId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  loadConversations: () => Promise<void>;
}

export function useChat(userId: string): UseChatReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser } = useAuth();
  const { sendMessage: socketSendMessage } = useSocket(userId);

  const loadConversations = async () => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    const conversationsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Conversation[];

    setConversations(conversationsData);
  };

  const sendMessage = useCallback(async (content: string, conversationId: string) => {
    if (!currentUser || !activeConversation) return;

    const newMessage: Message = {
      id: '', // Firestore will generate ID
      conversationId,
      senderId: currentUser.uid,
      content,
      timestamp: Date.now(),
      status: 'sent',
      type: 'text'
    };

    // Add message to Firestore
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const docRef = await addDoc(messagesRef, newMessage);
    
    // Send message through socket
    socketSendMessage({
      conversationId,
      content,
      senderId: currentUser.uid
    });

    // Update local state with Firestore-generated ID
    setMessages(prev => [...prev, { ...newMessage, id: docRef.id }]);
  }, [currentUser, activeConversation, socketSendMessage]);

  useEffect(() => {
    if (!activeConversation) return;

    const messagesRef = collection(db, 'conversations', activeConversation, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [activeConversation]);

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      )
    );
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    activeConversation,
    messages,
    isTyping,
    sendMessage,
    markAsRead,
    setActiveConversation,
    loadConversations
  };
}
