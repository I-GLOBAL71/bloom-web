import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Match, SwipeAction } from '../lib/models/user';

export function useMatches() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setMatches([]);
      setLoading(false);
      return;
    }

    // Subscribe to user's matches
    const matchesQuery = query(
      collection(db, 'matches'),
      where('users', 'array-contains', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(matchesQuery,
      (snapshot) => {
        const matchesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Match[];
        setMatches(matchesList);
        setLoading(false);
      },
      (error) => {
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const swipe = async (targetUserId: string, action: 'like' | 'superlike' | 'pass') => {
    if (!currentUser) throw new Error('No authenticated user');

    try {
      // Record the swipe action
      await addDoc(collection(db, 'swipes'), {
        userId: currentUser.uid,
        targetUserId,
        action,
        timestamp: Timestamp.now()
      } as SwipeAction);

      // If it's a like or superlike, check for a match
      if (action === 'like' || action === 'superlike') {
        const theirSwipe = query(
          collection(db, 'swipes'),
          where('userId', '==', targetUserId),
          where('targetUserId', '==', currentUser.uid),
          where('action', 'in', ['like', 'superlike'])
        );

        const snapshot = await theirSwipe.get();
        
        // If they've already liked us, create a match
        if (!snapshot.empty) {
          await addDoc(collection(db, 'matches'), {
            users: [currentUser.uid, targetUserId],
            timestamp: Timestamp.now()
          } as Match);
        }
      }
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  return {
    matches,
    loading,
    error,
    swipe
  };
}
