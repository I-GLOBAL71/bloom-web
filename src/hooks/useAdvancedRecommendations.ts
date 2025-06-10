import { useState, useEffect, useRef, useCallback } from 'react';
import type { User } from '../types';
import type { AdvancedMatchingScore } from '../types/matching';

interface UseAdvancedRecommendationsProps {
  currentUser: User;
  maxResults?: number;
}

interface RecommendationResult {
  user: User;
  score: AdvancedMatchingScore;
}

export function useAdvancedRecommendations({ currentUser, maxResults = 20 }: UseAdvancedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [cachedRecommendations, setCachedRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);
  
  // Track last preload time to prevent rapid consecutive preloads
  const lastPreloadTime = useRef<number>(0);
  const MIN_PRELOAD_INTERVAL = 5000; // Minimum 5 seconds between preloads

  // Mémoriser la promesse des données mockées pour éviter des imports multiples
  const mockDataPromise = useRef<Promise<{ MOCK_USERS: User[] }> | null>(null);

  const preloadMockData = useCallback(() => {
    if (!mockDataPromise.current) {
      mockDataPromise.current = import('../constants/mockData');
    }
    return mockDataPromise.current;
  }, []);

  const generateRecommendations = useCallback(async (count: number, excludeIds: Set<string> = new Set()) => {
    if (!currentUser?.id) return [];

    const { MOCK_USERS } = await preloadMockData();
    
    const potentialMatches = MOCK_USERS
      .filter(user => user.id !== currentUser.id && !excludeIds.has(user.id))
      .map(userData => userData as User);

    return potentialMatches
      .map(user => ({
        user,
        score: {
          userId: user.id,
          score: 0.8 + Math.random() * 0.2,
          matchingInterests: (user.interests || []).slice(0, 3),
          distance: Math.floor(Math.random() * 50),
          personalityCompatibility: 0.85,
          interactionScore: 0.7,
          eventScore: 0.75,
          profileScore: 0.9,
          dealBreakerFlags: [],
          boostMultiplier: 1.0,
          detailedScores: {
            interestMatch: 0.8,
            distance: 0.7,
            activity: 0.75,
            photoQuality: 0.9,
            personalityMatch: 0.85,
            interactionHistory: 0.7,
            eventParticipation: 0.75,
            profileCompleteness: 0.9
          }
        }
      }))
      .sort((a, b) => b.score.score - a.score.score)
      .slice(0, count);
  }, [currentUser, preloadMockData]);

  useEffect(() => {
    if (!currentUser?.id) return;

    let mounted = true;
    let initialLoad = true;

    const loadInitialRecommendations = async () => {
      if (!initialLoad) return;
      initialLoad = false;

      try {
        const updates: Partial<{
          recommendations: RecommendationResult[];
          cachedRecommendations: RecommendationResult[];
          error: string | null;
          loading: boolean;
          isPreloading: boolean;
        }> = { loading: true, error: null };

        // Charger la première série de recommandations
        const initialRecommendations = await generateRecommendations(maxResults);
        
        if (!mounted) return;

        if (initialRecommendations.length > 0) {
          updates.recommendations = initialRecommendations;

          // Précharger la prochaine série en parallèle
          const nextBatch = await generateRecommendations(
            maxResults,
            new Set(initialRecommendations.map(r => r.user.id))
          );
          
          if (mounted && nextBatch.length > 0) {
            updates.cachedRecommendations = nextBatch;
          }
        }

        // Appliquer toutes les mises à jour en une seule fois
        if (mounted) {
          setRecommendations(updates.recommendations || []);
          setCachedRecommendations(updates.cachedRecommendations || []);
          setLoading(false);
          setIsPreloading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading initial recommendations:', err);
        if (mounted) {
          setError('Erreur lors du chargement initial des recommandations');
          setLoading(false);
          setIsPreloading(false);
        }
      }
    };

    loadInitialRecommendations();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id, maxResults, generateRecommendations]);

  const refetch = useCallback(async () => {
    // Check loading state and time since last preload
    const now = Date.now();
    if (loading || isPreloading || (now - lastPreloadTime.current) < MIN_PRELOAD_INTERVAL) {
      console.log('Skipping refetch:', {
        loading,
        isPreloading,
        timeSinceLastPreload: now - lastPreloadTime.current
      });
      return null;
    }
    lastPreloadTime.current = now;

    console.log('Starting refetch, current state:', {
      hasCache: cachedRecommendations.length > 0,
      currentRecommendations: recommendations.length
    });

    try {
      let newRecommendations: RecommendationResult[] = [];

      // Si on a des recommendations en cache, les utiliser immédiatement
      if (cachedRecommendations.length > 0) {
        console.log('Using cached recommendations:', cachedRecommendations.length);
        newRecommendations = cachedRecommendations;
        setRecommendations(cachedRecommendations);
        setCachedRecommendations([]);
        
        // Schedule background preload with a delay to prevent cascading
        setTimeout(async () => {
          if (!loading && !isPreloading) {
            setIsPreloading(true);
            try {
              const nextBatch = await generateRecommendations(
                maxResults,
                new Set([...recommendations, ...cachedRecommendations].map(r => r.user.id))
              );

              if (nextBatch.length > 0) {
                console.log('Generated new batch for cache:', nextBatch.length);
                setCachedRecommendations(nextBatch);
              }
            } finally {
              setIsPreloading(false);
            }
          }
        }, 2000);
      } else {
        // Générer de nouvelles recommendations
        console.log('Generating new recommendations');
        setLoading(true);
        setError(null);

        const freshRecommendations = await generateRecommendations(maxResults);
        
        if (freshRecommendations.length > 0) {
          console.log('Generated fresh recommendations:', freshRecommendations.length);
          newRecommendations = freshRecommendations;
          setRecommendations(freshRecommendations);

          // Précharger la prochaine série
          // Schedule background preload with a delay
          setTimeout(async () => {
            if (!loading && !isPreloading) {
              setIsPreloading(true);
              try {
                const nextBatch = await generateRecommendations(
                  maxResults,
                  new Set(freshRecommendations.map(r => r.user.id))
                );

                if (nextBatch.length > 0) {
                  console.log('Generated new batch for cache:', nextBatch.length);
                  setCachedRecommendations(nextBatch);
                }
              } finally {
                setIsPreloading(false);
              }
            }
          }, 2000);
        } else {
          console.log('No recommendations generated');
          throw new Error('No recommendations available');
        }
      }

      setError(null);
      return newRecommendations;
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Erreur lors de la récupération des recommandations');
      return null;
    } finally {
      setLoading(false);
      setIsPreloading(false);
    }
  }, [
    loading,
    isPreloading,
    cachedRecommendations,
    recommendations,
    generateRecommendations,
    maxResults
  ]);

  return {
    recommendations,
    loading,
    error,
    refetch,
    hasCache: cachedRecommendations.length > 0,
    isPreloading
  };
}