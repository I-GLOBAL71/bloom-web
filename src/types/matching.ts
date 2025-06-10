import { UserPreferences, RecommendationScore } from '../lib/recommendation/types';

export interface MatchingWeights {
  interestMatch: number;
  distance: number;
  activity: number;
  photoQuality: number;
  personalityMatch: number;
  interactionHistory: number;
  eventParticipation: number;
  profileCompleteness: number;
}

export interface PersonalityFactors {
  extroversion: number; // 1-10
  openness: number;
  conscientiousness: number;
  agreeableness: number;
  emotionalStability: number;
}

export interface InteractionHistory {
  likes: number;
  messages: number;
  messageResponseRate: number;
  eventsMutuallyAttended: number;
  blockCount: number;
  reportCount: number;
}

export interface MatchingPreferences extends UserPreferences {
  personalityWeights: PersonalityFactors;
  dealBreakers: {
    mustHavePhoto: boolean;
    minProfileCompletion: number;
    maxDistance: number;
    hasVerifiedProfile: boolean;
    noReports: boolean;
  };
  boostFactors: {
    verifiedProfile: number;
    premium: number;
    mutualConnections: number;
    activeInLastWeek: number;
  };
}

export interface AdvancedMatchingScore extends RecommendationScore {
  personalityCompatibility: number;
  interactionScore: number;
  eventScore: number;
  profileScore: number;
  dealBreakerFlags: string[];
  boostMultiplier: number;
  detailedScores: {
    [K in keyof MatchingWeights]: number;
  };
}