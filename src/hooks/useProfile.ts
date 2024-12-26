import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Profile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  updatedAt: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useAuth();

  const processPhotoURL = useCallback((url: string | null) => {
    if (!url) return '';
    if (url.includes('googleusercontent.com')) {
      const baseUrl = url.split('=')[0];
      return `${baseUrl}=s96-c`;
    }
    return url;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const profileRef = doc(db, 'profiles', currentUser.uid);

    // Set up real-time listener
    const unsubscribe = onSnapshot(profileRef, 
      (doc) => {
        if (doc.exists()) {
          setProfile({
            id: doc.id,
            ...doc.data(),
          } as Profile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching profile:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [currentUser]);

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    if (!currentUser) throw new Error('No user authenticated');
    
    const profileRef = doc(db, 'profiles', currentUser.uid);
    try {
      await setDoc(profileRef, {
        ...data,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [currentUser]);

  return { profile, loading, error, updateProfile };
}
