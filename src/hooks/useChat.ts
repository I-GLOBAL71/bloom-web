import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../lib/models/user';

export function useChat(matchId: string) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser || !matchId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Subscribe to messages for this match
    const messagesQuery = query(
      collection(db, 'messages'),
      where('matchId', '==', matchId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery,
      (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(messagesList);
        setLoading(false);
      },
      (error) => {
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, matchId]);

  const sendMessage = async (text: string) => {
    if (!currentUser || !matchId) throw new Error('Missing required data');

    try {
      await addDoc(collection(db, 'messages'), {
        matchId,
        senderId: currentUser.uid,
        text,
        timestamp: Timestamp.now(),
        read: false
      } as Message);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage
  };
}
