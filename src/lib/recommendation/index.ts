import type { User } from '../../types';
import type { RecommendationFilters, UserPreferences } from './types';
import { calculateUserScore } from './scoring';
import { filterUsers } from './filters';

export function getRecommendedUsers(
  users: User[],
  currentUser: User,
  preferences: UserPreferences,
  filters: RecommendationFilters = {},
  limit: number = 10
): User[] {
  // First apply filters
  const filteredUsers = filterUsers(users, preferences, filters);

  // Calculate scores for remaining users
  const scoredUsers = filteredUsers
    .map(user => ({
      user,
      score: calculateUserScore(user, currentUser)
    }))
    .sort((a, b) => b.score.score - a.score.score);

  // Return top N users
  return scoredUsers
    .slice(0, limit)
    .map(({ user }) => user);
}