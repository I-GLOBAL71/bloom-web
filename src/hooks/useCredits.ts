import { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useCredits() {
  const { currentUser } = useAuth();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setCredits(0);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    
    const unsubscribe = onSnapshot(userRef, 
      (doc) => {
        if (doc.exists()) {
          setCredits(doc.data()?.credits || 0);
        }
        setLoading(false);
      },
      (error) => {
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addCredits = async (amount: number) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        credits: increment(amount)
      });
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const useCredits = async (amount: number) => {
    if (!currentUser) throw new Error('No authenticated user');
    if (credits < amount) throw new Error('Insufficient credits');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        credits: increment(-amount)
      });
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  return {
    credits,
    loading,
    error,
    addCredits,
    useCredits
  };
}
