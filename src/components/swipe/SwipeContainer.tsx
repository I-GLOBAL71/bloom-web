import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdvancedRecommendations } from '../../hooks/useAdvancedRecommendations';
import { SwipeCard } from './SwipeCard';
import { useNavigate } from 'react-router-dom';
import { sendContactRequest } from '../../lib/firebase/contacts';
import { toast } from 'react-hot-toast';
import type { User } from '../../types';
import type { AdvancedMatchingScore } from '../../types/matching';

export function SwipeContainer() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const initialLoadRef = useRef(true);

  const {
    recommendations,
    loading,
    error,
    refetch,
    hasCache,
    isPreloading
  } = useAdvancedRecommendations({
    currentUser: currentUser as User,
    maxResults: 30
  });

  const lastPreloadRequestRef = useRef<number>(0);
  const MIN_PRELOAD_REQUEST_INTERVAL = 5000;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const now = Date.now();
    const timeSinceLastPreload = now - lastPreloadRequestRef.current;
    
    if (!loading &&
        !isTransitioning &&
        !isPreloading &&
        !initialLoadRef.current &&
        recommendations?.length > 0 &&
        activeIndex >= recommendations.length - 2 &&
        timeSinceLastPreload >= MIN_PRELOAD_REQUEST_INTERVAL) {
      
      console.log('Préchargement des profils suivants...');
      lastPreloadRequestRef.current = now;
      
      timer = setTimeout(() => {
        if (!loading && !isPreloading) {
          refetch().catch(console.error);
        }
      }, 1500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [activeIndex, loading, isPreloading]);

  useEffect(() => {
    if (recommendations?.length > 0 && initialLoadRef.current) {
      initialLoadRef.current = false;
    }
  }, [recommendations?.length]);

  const handleNextProfile = useCallback(async () => {
    console.log('Current state:', { activeIndex, totalRecommendations: recommendations?.length });
    
    if (!recommendations || activeIndex >= recommendations.length - 1) {
      console.log('Fetching new recommendations...');
      await refetch();
      
      if (!recommendations || recommendations.length === 0) {
        console.error('No recommendations available');
        return false;
      }

      console.log('Setting index to 0, recommendations:', recommendations.length);
      setActiveIndex(0);
      return true;
    }

    const nextIndex = activeIndex + 1;
    if (nextIndex < recommendations.length) {
      console.log('Moving to next index:', nextIndex);
      setActiveIndex(nextIndex);
      return true;
    }

    return false;
  }, [activeIndex, recommendations, refetch]);

  const [key, setKey] = useState(0);
  
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [activeIndex]);

  const goToNext = useCallback(async () => {
    if (isAnimating || isTransitioning) {
      console.log('Animation or transition in progress, skipping goToNext');
      return;
    }

    console.log('Starting profile transition');
    setIsAnimating(true);
    setIsTransitioning(true);
    setLocalError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const success = await handleNextProfile();

      if (!success) {
        console.log('Retrying profile update...');
        await new Promise(resolve => setTimeout(resolve, 300));
        const retrySuccess = await handleNextProfile();
        
        if (!retrySuccess) {
          throw new Error('Failed to load next profile');
        }
      }

      await new Promise(resolve => requestAnimationFrame(resolve));

    } catch (error) {
      console.error('Error during profile transition:', error);
      setLocalError('Erreur lors du chargement du profil suivant');
    } finally {
      setIsTransitioning(false);
      setIsAnimating(false);
    }
  }, [isAnimating, isTransitioning, handleNextProfile]);

  const handleLike = useCallback(async (targetUser: User) => {
    if (isAnimating || isTransitioning) return;

    console.log('handleLike received:', {
      targetUser,
      currentUser,
      targetId: targetUser?.id,
      currentId: currentUser?.id
    });

    if (!currentUser?.id || !targetUser?.id) {
      console.error('Invalid user data for like action', {
        hasCurrentUser: !!currentUser,
        hasTargetUser: !!targetUser,
        currentUserId: currentUser?.id,
        targetUserId: targetUser?.id
      });
      return;
    }

    const interactionId = `${currentUser.id}_${targetUser.id}`;
    console.log('Like simulé pour:', targetUser.displayName);
    
    await new Promise(resolve => setTimeout(resolve, 350));
    await goToNext();
  }, [currentUser, goToNext, isAnimating, isTransitioning]);

  const handleContactRequest = useCallback(async (targetUser: User) => {
    if (isAnimating || isTransitioning) return;

    if (!currentUser || !targetUser?.id) {
      console.error('Invalid user data for contact request');
      return;
    }

    console.log('Envoi de la demande de contact pour:', targetUser.displayName);
    try {
      await sendContactRequest({
        senderId: currentUser.id,
        senderName: currentUser.displayName || '',
        senderPhotoURL: currentUser.photoURL || '',
        receiverId: targetUser.id,
        receiverName: targetUser.displayName || '',
        receiverPhotoURL: targetUser.photoURL || ''
      });
      
      toast.success(`Demande de contact envoyée à ${targetUser.displayName}!`, {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 3000,
      });
      
      await goToNext();
    } catch (error) {
      console.error('Error sending contact request:', error);
      if (error instanceof Error) {
        toast.error(error.message, {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    }
  }, [currentUser, goToNext, isAnimating, isTransitioning]);

  const handleMessageRequest = useCallback(async (targetUser: User) => {
    if (isAnimating || isTransitioning) return;

    if (!currentUser || !targetUser?.id) {
      console.error('Invalid user data for message request');
      return;
    }

    console.log('Navigation vers la conversation avec:', targetUser.displayName);
    
    navigate('/app', {
      state: {
        recipient: targetUser
      }
    });
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('setActiveTab', {
        detail: { tab: 'messages' }
      }));
    }, 100);
  }, [currentUser, navigate, isAnimating, isTransitioning]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleSwipe = useCallback(async (action: 'like' | 'dislike' | 'message' | 'contact', user: User) => {
    if (isAnimating || isTransitioning) {
      console.log('Animation or transition in progress, ignoring swipe');
      return;
    }

    console.log('handleSwipe received:', {
      action,
      user,
      userId: user?.id,
      isUserComplete: !!(user && user.id)
    });

    if (!user || typeof user !== 'object' || !user.id) {
      console.error('Invalid user data in handleSwipe', {
        receivedUser: user,
        action
      });
      return;
    }

    if (action === 'message' || action === 'contact') {
      if (!currentUser) {
        console.error('User must be logged in to send messages or contact requests');
        return;
      }

      if (action === 'message') {
        console.log('Navigation vers la conversation avec:', user.displayName);
        navigate('/app', {
          state: {
            recipient: user
          }
        });
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('setActiveTab', {
            detail: { tab: 'messages' }
          }));
        }, 100);
      } else {
        console.log('Envoi de la demande de contact pour:', user.displayName);
        try {
          await sendContactRequest({
            senderId: currentUser.id,
            senderName: currentUser.displayName || '',
            senderPhotoURL: currentUser.photoURL || '',
            receiverId: user.id,
            receiverName: user.displayName || '',
            receiverPhotoURL: user.photoURL || ''
          });
          
          toast.success(`Demande de contact envoyée à ${user.displayName}!`, {
            icon: '👋',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            duration: 3000,
          });
          
          await goToNext();
        } catch (error) {
          console.error('Error sending contact request:', error);
          if (error instanceof Error) {
            toast.error(error.message, {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
          }
        }
      }
      return;
    }

    setIsAnimating(true);
    try {
      if (action === 'like') {
        await handleLike(user);
      } else if (action === 'dislike') {
        await goToNext();
      }
    } catch (error) {
      console.error('Error in handleSwipe:', error);
    } finally {
      setIsAnimating(false);
    }
  }, [handleLike, handleMessageRequest, handleContactRequest, goToNext, isAnimating, isTransitioning, navigate]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-600">
          <p>Veuillez vous connecter pour accéder aux profils</p>
        </div>
      </div>
    );
  }

  if (loading && recommendations?.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Recherche de profils compatibles...</p>
        </div>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <p>{error || localError}</p>
          <button
            onClick={() => {
              setLocalError(null);
              refetch();
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = recommendations?.[activeIndex];

  if (!currentMatch?.user?.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-600">
          <p>Impossible de charger le profil</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (activeIndex >= recommendations.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-600">
          <p>Chargement de nouveaux profils...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className={`w-full h-full transition-opacity duration-300 ${
        isTransitioning ? 'opacity-50' : 'opacity-100'
      }`}>
        {currentMatch && (
          <SwipeCard
            key={`${currentMatch.user.id}_${key}`}
            user={currentMatch.user}
            score={currentMatch.score}
            onSwipe={(action) => handleSwipe(action, currentMatch.user)}
          />
        )}
      </div>

      {(isTransitioning || localError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] z-50 transition-all duration-300">
          <div className="text-center">
            {localError ? (
              <>
                <p className="text-red-600 mb-4">{localError}</p>
                <button
                  onClick={() => {
                    setLocalError(null);
                    refetch();
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Réessayer
                </button>
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">Chargement du prochain profil...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}