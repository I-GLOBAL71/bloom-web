import { useState, useEffect } from 'react';
import { Message, Conversation, ChatUser } from '../types';

export function useChat(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string, conversationId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userId,
      receiverId: '', // Set from conversation
      content,
      timestamp: Date.now(),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    // Here you would integrate with your backend
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      )
    );
  };

  return {
    conversations,
    activeConversation,
    messages,
    isTyping,
    sendMessage,
    markAsRead,
    setActiveConversation
  };
}