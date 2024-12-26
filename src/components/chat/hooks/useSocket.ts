import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/chatStore';
import { Message } from '../types';

let socket: Socket | null = null;

export function useSocket(userId: string) {
  const { addMessage, setTyping } = useChatStore();

  const initSocket = useCallback(() => {
    if (!socket) {
      socket = io('wss://api.bloom.com', {
        auth: { userId },
        transports: ['websocket'],
      });

      socket.on('message', (message: Message) => {
        addMessage(message);
      });

      socket.on('typing', ({ userId: typingUserId, isTyping }) => {
        setTyping(isTyping);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [userId, addMessage, setTyping]);

  useEffect(() => {
    const cleanup = initSocket();
    return cleanup;
  }, [initSocket]);

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socket) {
      socket.emit('message', message);
    }
  }, []);

  const emitTyping = useCallback((isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { isTyping });
    }
  }, []);

  return { sendMessage, emitTyping };
}