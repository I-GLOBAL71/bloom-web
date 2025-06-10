import type { User } from '../../types';
import type { RecommendationFilters, UserPreferences } from './types';

export function filterUsers(
  users: User[],
  preferences: UserPreferences,
  filters: RecommendationFilters = {}
): User[] {
  return users.filter(user => {
    // Filter by gender preference
    if (user.gender && !preferences.interestedIn.includes(user.gender)) {
      return false;
    }

    // Removed age filtering as it's not part of the User type

    // Filter by photo requirement
    if (filters.mustHavePhoto && (!user.photos || user.photos.length === 0)) {
      return false;
    }

    // Filter by online status
    if (filters.onlineOnly && user.lastActive) {
      const hoursSinceActive = (Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60);
      if (hoursSinceActive > 1) { // More than 1 hour inactive
        return false;
      }
    }

    // Filter by required interests
    if (filters.withInterests?.length && user.interests?.length) {
      const hasRequiredInterests = filters.withInterests.some(interest =>
        user.interests?.includes(interest)
      );
      if (!hasRequiredInterests) {
        return false;
      }
    }

    return true;
  });
}