import { useState, useEffect } from 'react';
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase/config';
import type { ContactRequest } from '../types';

export function useContactRequests() {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!user?.id) return;

    const contactRequestsRef = collection(db, 'contactRequests');

    // Requête pour les demandes envoyées
    const sentQuery = query(
      contactRequestsRef,
      where('senderId', '==', user.id)
    );

    // Requête pour les demandes reçues
    const receivedQuery = query(
      contactRequestsRef,
      where('receiverId', '==', user.id)
    );

    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as ContactRequest[];
      setSentRequests(requests);
    }, (error) => {
      console.error('Error fetching sent requests:', error);
      setError('Erreur lors du chargement des demandes envoyées');
    });

    const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as ContactRequest[];
      setReceivedRequests(requests);
    }, (error) => {
      console.error('Error fetching received requests:', error);
      setError('Erreur lors du chargement des demandes reçues');
    });

    setLoading(false);

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [user]);

  return {
    sentRequests,
    receivedRequests,
    loading,
    error
  };
}