import type { User } from '../../types';
import type { RecommendationScore, UserPreferences } from './types';
import { calculateDistance } from '../utils/geoUtils';

const INTEREST_MATCH_WEIGHT = 0.4;
const DISTANCE_WEIGHT = 0.3;
const ACTIVITY_WEIGHT = 0.2;
const PHOTO_WEIGHT = 0.1;

export function calculateUserScore(
  user: User,
  currentUser: User
): RecommendationScore {
 // Calculate matching interests score
 const userInterests = user.interests || [];
 const currentUserInterests = currentUser.interests || [];
 const matchingInterests = userInterests.filter(interest =>
   currentUserInterests.includes(interest)
 );
 const interestScore = matchingInterests.length / Math.max(currentUserInterests.length || 1, userInterests.length || 1);

 // Calculate distance score (inverse - closer is better)
 const distance = calculateDistance(
   currentUser.location?.city || '',
   currentUser.location?.country || '',
   user.location?.city || '',
   user.location?.country || ''
 );
 const distanceScore = Math.max(0, 1 - (distance / 1000)); // Normalize to 0-1, max distance 1000km

 // Calculate activity score based on last active
 const hoursSinceActive = user.lastActive
   ? (Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60)
   : 168; // Default to a week if no lastActive
 const activityScore = Math.max(0, 1 - (hoursSinceActive / 168)); // Week as reference

 // Photo score - more photos = better profile
 const photoScore = Math.min(1, (user.photos?.length || 0) / 3); // 3 photos as ideal

  // Calculate weighted total score
  const totalScore = 
    (interestScore * INTEREST_MATCH_WEIGHT) +
    (distanceScore * DISTANCE_WEIGHT) +
    (activityScore * ACTIVITY_WEIGHT) +
    (photoScore * PHOTO_WEIGHT);

  return {
    userId: user.id,
    score: totalScore,
    matchingInterests,
    distance
  };
}