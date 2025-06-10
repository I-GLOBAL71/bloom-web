import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendedUsers } from '../lib/recommendation';
import type { User } from '../types';
import type { RecommendationFilters, UserPreferences } from '../lib/recommendation/types';
import { MOCK_USER } from '../constants/mockData';

export function useRecommendations(filters: RecommendationFilters = {}) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [currentUser] = useState<User>({
    ...MOCK_USER,
    id: user?.id || 'mock-user',
    email: user?.email || 'mock@example.com',
    displayName: user?.displayName || 'Mock User',
    gender: 'bumblebee',
    interests: ['art', 'music', 'travel'],
    location: {
      city: 'Paris',
      country: 'France'
    }
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'sophie@example.com',
            displayName: 'Sophie',
            bio: 'Passionate about art and nature 🎨🌿',
            photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330'],
            gender: 'rose',
            location: { city: 'Paris', country: 'France' },
            interests: ['art', 'nature', 'photography'],
            flowers: 100,
            isPremium: false,
            lastActive: new Date(),
            createdAt: new Date(),
            profession: 'Artist'
          },
          {
            id: '2',
            email: 'emma@example.com',
            displayName: 'Emma',
            bio: 'Coffee enthusiast and weekend hiker ☕️🏃‍♂️',
            photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80'],
            gender: 'rose',
            location: { city: 'London', country: 'UK' },
            interests: ['music', 'travel', 'coffee'],
            flowers: 150,
            isPremium: true,
            lastActive: new Date(),
            createdAt: new Date(),
            profession: 'Coffee Roaster'
          }
        ];

        const userPreferences: UserPreferences = {
          interestedIn: ['rose'], // Get from user profile
          interests: currentUser.interests || [],
          location: {
            city: currentUser.location?.city || 'Paris',
            country: currentUser.location?.country || 'France'
          },
          ageRange: {
            min: 18,
            max: 45
          }
        };

        const recommendedUsers = getRecommendedUsers(
          mockUsers,
          currentUser,
          userPreferences,
          filters
        );

        setRecommendations(recommendedUsers);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser.id, filters.maxDistance, filters.minAge, filters.maxAge, filters.mustHavePhoto]);

  return { recommendations, loading, error };
}