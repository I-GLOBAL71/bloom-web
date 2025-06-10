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
  age?: number;
  gender?: string;
  hobbies?: string[];
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
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const setupProfileListener = async () => {
      if (!currentUser) {
        if (isMounted) {
          setProfile(null);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        
        unsubscribe = onSnapshot(
          profileRef,
          (doc) => {
            if (!isMounted) return;
            
            if (doc.exists()) {
              const profileData = doc.data();
              const newProfile = {
                id: doc.id,
                email: profileData.email,
                displayName: profileData.displayName,
                photoURL: processPhotoURL(profileData.photoURL),
                createdAt: profileData.createdAt,
                updatedAt: profileData.updatedAt,
                age: profileData.age,
                gender: profileData.gender,
                hobbies: profileData.hobbies,
              };
              
              setProfile(newProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
            setError(null);
          },
          (error) => {
            if (!isMounted) return;
            console.error('Error fetching profile:', error);
            setError(error as Error);
            setLoading(false);
          }
        );
      } catch (err) {
        if (!isMounted) return;
        console.error('Error setting up profile listener:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    setupProfileListener();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, processPhotoURL]);

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    if (!currentUser) {
      throw new Error('No user authenticated');
    }
    
    const profileRef = doc(db, 'profiles', currentUser.uid);
    
    try {
      const updatedData = {
        ...data,
        updatedAt: Date.now(),
      };

      await setDoc(profileRef, updatedData, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [currentUser]);

  return { profile, loading, error, updateProfile };
}
