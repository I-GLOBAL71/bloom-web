import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SwipeCard } from './SwipeCard';
import { SwipeActions } from './SwipeActions';
import { UserStats } from './UserStats';
import { useMatches } from '../../../hooks/useMatches';
import { useProfile } from '../../../hooks/useProfile';
import { collection, query, where, getDocs, limit, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { UserProfile } from '../../../lib/models/user';
import { generateTestProfiles } from '../../../lib/testData';

export function SwipeSection() {
  const { profile } = useProfile();
  const { swipe } = useMatches();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    if (!profile) return;

    const fetchProfiles = async () => {
      try {
        const isTestMode = process.env.NODE_ENV === 'development';
        const collectionName = isTestMode ? 'test_profiles' : 'profiles';
        
        // Créer une requête de base
        let profilesQuery = query(
          collection(db, collectionName),
          limit(10)
        );

        // Ajouter des filtres si les préférences sont définies
        if (profile.settings?.showMe) {
          profilesQuery = query(
            collection(db, collectionName),
            where('gender', '==', profile.settings.showMe),
            limit(10)
          );
        }

        const snapshot = await getDocs(profilesQuery);
        const fetchedProfiles = snapshot.docs
          .map(doc => {
            const data = doc.data();
            // If birthDate is missing, create a default one (25 years ago)
            if (!data.birthDate || typeof data.birthDate.toDate !== 'function') {
              const defaultAge = 25;
              const today = new Date();
              const birthYear = today.getFullYear() - defaultAge;
              data.birthDate = Timestamp.fromDate(new Date(birthYear, today.getMonth(), today.getDate()));
              
              // Update the document with the default birthDate
              setDoc(doc.ref, { birthDate: data.birthDate }, { merge: true })
                .catch(err => console.error('Error updating birthDate:', err));
            }
            return { id: doc.id, ...data } as UserProfile;
          })
          .filter(p => p.id !== profile.id);

        if (fetchedProfiles.length === 0) {
          console.log('No profiles found. Checking test_profiles collection...');
          // If no profiles found and we're not already in test mode, try test_profiles
          if (!isTestMode) {
            const testProfilesQuery = query(
              collection(db, 'test_profiles'),
              limit(10)
            );
            const testSnapshot = await getDocs(testProfilesQuery);
            const testProfiles = testSnapshot.docs
              .map(doc => {
                const data = doc.data();
                // If birthDate is missing, create a default one (25 years ago)
                if (!data.birthDate || typeof data.birthDate.toDate !== 'function') {
                  const defaultAge = 25;
                  const today = new Date();
                  const birthYear = today.getFullYear() - defaultAge;
                  data.birthDate = Timestamp.fromDate(new Date(birthYear, today.getMonth(), today.getDate()));
                  
                  // Update the document with the default birthDate
                  setDoc(doc.ref, { birthDate: data.birthDate }, { merge: true })
                    .catch(err => console.error('Error updating birthDate:', err));
                }
                return { id: doc.id, ...data } as UserProfile;
              })
              .filter(p => p.id !== profile.id);
            setProfiles(testProfiles);
          }
        } else {
          setProfiles(fetchedProfiles);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [profile]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentProfile) return;

    setDirection(direction);
    
    try {
      await swipe(currentProfile.id, direction === 'right' ? 'like' : 'pass');
    } catch (error) {
      console.error('Error processing swipe:', error);
    }

    // Passer au profil suivant
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 300);
  };

  const handleGenerateTestProfiles = async () => {
    setLoading(true);
    try {
      await generateTestProfiles();
      // Fetch profiles again after generating test profiles
      const fetchProfiles = async () => {
        try {
          const isTestMode = process.env.NODE_ENV === 'development';
          const collectionName = isTestMode ? 'test_profiles' : 'profiles';
          
          // Créer une requête de base
          let profilesQuery = query(
            collection(db, collectionName),
            limit(10)
          );

          // Ajouter des filtres si les préférences sont définies
          if (profile.settings?.showMe) {
            profilesQuery = query(
              collection(db, collectionName),
              where('gender', '==', profile.settings.showMe),
              limit(10)
            );
          }

          const snapshot = await getDocs(profilesQuery);
          const fetchedProfiles = snapshot.docs
            .map(doc => {
              const data = doc.data();
              // If birthDate is missing, create a default one (25 years ago)
              if (!data.birthDate || typeof data.birthDate.toDate !== 'function') {
                const defaultAge = 25;
                const today = new Date();
                const birthYear = today.getFullYear() - defaultAge;
                data.birthDate = Timestamp.fromDate(new Date(birthYear, today.getMonth(), today.getDate()));
                
                // Update the document with the default birthDate
                setDoc(doc.ref, { birthDate: data.birthDate }, { merge: true })
                  .catch(err => console.error('Error updating birthDate:', err));
              }
              return { id: doc.id, ...data } as UserProfile;
            })
            .filter(p => p.id !== profile.id);

          if (fetchedProfiles.length === 0) {
            console.log('No profiles found. Checking test_profiles collection...');
            // If no profiles found and we're not already in test mode, try test_profiles
            if (!isTestMode) {
              const testProfilesQuery = query(
                collection(db, 'test_profiles'),
                limit(10)
              );
              const testSnapshot = await getDocs(testProfilesQuery);
              const testProfiles = testSnapshot.docs
                .map(doc => {
                  const data = doc.data();
                  // If birthDate is missing, create a default one (25 years ago)
                  if (!data.birthDate || typeof data.birthDate.toDate !== 'function') {
                    const defaultAge = 25;
                    const today = new Date();
                    const birthYear = today.getFullYear() - defaultAge;
                    data.birthDate = Timestamp.fromDate(new Date(birthYear, today.getMonth(), today.getDate()));
                    
                    // Update the document with the default birthDate
                    setDoc(doc.ref, { birthDate: data.birthDate }, { merge: true })
                      .catch(err => console.error('Error updating birthDate:', err));
                  }
                  return { id: doc.id, ...data } as UserProfile;
                })
                .filter(p => p.id !== profile.id);
              setProfiles(testProfiles);
            }
          } else {
            setProfiles(fetchedProfiles);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching profiles:', error);
          setLoading(false);
        }
      };
      fetchProfiles();
    } catch (error) {
      console.error('Error generating test profiles:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="mt-4 text-gray-600">Loading profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <p className="text-gray-600 mb-4">No profiles found</p>
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={handleGenerateTestProfiles}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            Generate Test Profiles
          </button>
        )}
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="h-full flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Plus de profils disponibles</h2>
          <p className="text-gray-600">Revenez plus tard pour découvrir de nouveaux profils</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="relative w-full max-w-lg aspect-[3/4]">
        <AnimatePresence mode="wait">
          <SwipeCard
            key={currentProfile.id}
            profile={currentProfile}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Statistiques de l'utilisateur */}
      <div className="mt-8">
        <UserStats />
      </div>

      {/* Actions de swipe */}
      <div className="mt-8">
        <SwipeActions 
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
          disabled={!currentProfile}
        />
      </div>
    </div>
  );
}