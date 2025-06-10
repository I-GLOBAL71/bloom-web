import type { User } from '../../types';
import type { MatchingWeights, MatchingPreferences, PersonalityFactors, AdvancedMatchingScore, InteractionHistory } from '../../types/matching';
import { calculateDistance } from '../utils/geoUtils';

const DEFAULT_WEIGHTS: MatchingWeights = {
  interestMatch: 0.25,
  distance: 0.20,
  activity: 0.10,
  photoQuality: 0.05,
  personalityMatch: 0.15,
  interactionHistory: 0.10,
  eventParticipation: 0.10,
  profileCompleteness: 0.05,
};

export function calculatePersonalityCompatibility(
  user1: PersonalityFactors,
  user2: PersonalityFactors
): number {
  // Calcul de la distance euclidienne normalisée entre les profils de personnalité
  const factors = ['extroversion', 'openness', 'conscientiousness', 'agreeableness', 'emotionalStability'] as const;
  const maxDistance = Math.sqrt(factors.length * Math.pow(10, 2)); // Distance max possible (échelle 1-10)
  
  const distance = Math.sqrt(
    factors.reduce((sum, factor) => {
      return sum + Math.pow(user1[factor] - user2[factor], 2);
    }, 0)
  );

  return 1 - (distance / maxDistance); // Normalise entre 0-1, où 1 = parfaitement compatible
}

export function calculateInteractionScore(history: InteractionHistory): number {
  const { likes, messages, messageResponseRate, eventsMutuallyAttended, blockCount, reportCount } = history;
  
  // Pénalités sévères pour les blocks et reports
  if (blockCount > 0 || reportCount > 0) {
    return 0;
  }

  const interactionScore = 
    (Math.min(likes, 10) / 10) * 0.3 + // Max 10 likes
    (Math.min(messages, 50) / 50) * 0.3 + // Max 50 messages
    messageResponseRate * 0.2 +
    (Math.min(eventsMutuallyAttended, 5) / 5) * 0.2; // Max 5 events

  return interactionScore;
}

function calculateProfileScore(user: User): number {
  const requiredFields = [
    'bio',
    'interests',
    'location',
    'profession',
    'photos',
  ];

  const completedFields = requiredFields.filter(field => {
    const value = user[field as keyof User];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  });

  return completedFields.length / requiredFields.length;
}

export function calculateAdvancedScore(
  user: User,
  currentUser: User,
  preferences: MatchingPreferences,
  weights: MatchingWeights = DEFAULT_WEIGHTS,
  interactionHistory: InteractionHistory
): AdvancedMatchingScore {
  // Vérification des deal breakers
  const dealBreakerFlags: string[] = [];
  
  if (preferences.dealBreakers.mustHavePhoto && (!user.photos || user.photos.length === 0)) {
    dealBreakerFlags.push('NO_PHOTOS');
  }

  if (preferences.dealBreakers.hasVerifiedProfile && !user.isVerified) {
    dealBreakerFlags.push('NOT_VERIFIED');
  }

  // Définir les valeurs par défaut
  const defaultLocation = { city: '', country: '' };
  const defaultDate = new Date();
  const emptyArray: any[] = [];

  const userLocation = user.location || defaultLocation;
  const currentUserLocation = currentUser.location || defaultLocation;
  const userInterests = user.interests || emptyArray;
  const currentUserInterests = currentUser.interests || emptyArray;
  const userPhotos = user.photos || emptyArray;
  const userLastActive = user.lastActive || defaultDate;

  // Calculate distance only if both locations have city and country
  const distance = userLocation.city && userLocation.country &&
                  currentUserLocation.city && currentUserLocation.country
    ? calculateDistance(
        currentUserLocation.city,
        currentUserLocation.country,
        userLocation.city,
        userLocation.country
      )
    : 1000; // Default to max distance if location info is missing

  if (preferences.dealBreakers.maxDistance && distance > preferences.dealBreakers.maxDistance) {
    dealBreakerFlags.push('TOO_FAR');
  }

  // Calcul des scores individuels
  const matchingInterests = userInterests.filter(interest =>
    currentUserInterests.includes(interest)
  );
  const interestScore = matchingInterests.length / Math.max(currentUserInterests.length, userInterests.length);
  
  const distanceScore = Math.max(0, 1 - (distance / 1000)); // Normalise à 1000km
  
  const hoursSinceActive = (Date.now() - userLastActive.getTime()) / (1000 * 60 * 60);
  const activityScore = Math.max(0, 1 - (hoursSinceActive / 168)); // Semaine comme référence
  
  const photoScore = Math.min(1, userPhotos.length / 3); // 3 photos comme idéal
  
  // Définir les facteurs de personnalité par défaut
  const defaultPersonalityFactors = {
    extroversion: 5,
    openness: 5,
    conscientiousness: 5,
    agreeableness: 5,
    emotionalStability: 5
  };

  const personalityCompatibility = calculatePersonalityCompatibility(
    currentUser.personalityFactors || defaultPersonalityFactors,
    user.personalityFactors || defaultPersonalityFactors
  );
  
  const interactionScore = calculateInteractionScore(interactionHistory);
  
  const eventScore = Math.min(1, interactionHistory.eventsMutuallyAttended / 5);
  
  const profileScore = calculateProfileScore(user);

  // Calcul du boost
  let boostMultiplier = 1;
  if (user.isVerified) boostMultiplier += preferences.boostFactors.verifiedProfile;
  if (user.isPremium) boostMultiplier += preferences.boostFactors.premium;
  if (userLastActive.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
    boostMultiplier += preferences.boostFactors.activeInLastWeek;
  }

  // Scores détaillés
  const detailedScores = {
    interestMatch: interestScore * weights.interestMatch,
    distance: distanceScore * weights.distance,
    activity: activityScore * weights.activity,
    photoQuality: photoScore * weights.photoQuality,
    personalityMatch: personalityCompatibility * weights.personalityMatch,
    interactionHistory: interactionScore * weights.interactionHistory,
    eventParticipation: eventScore * weights.eventParticipation,
    profileCompleteness: profileScore * weights.profileCompleteness,
  };

  // Score total pondéré
  const totalScore = Object.values(detailedScores).reduce((sum, score) => sum + score, 0) * boostMultiplier;

  return {
    userId: user.id,
    score: totalScore,
    matchingInterests,
    distance,
    personalityCompatibility,
    interactionScore,
    eventScore,
    profileScore,
    dealBreakerFlags,
    boostMultiplier,
    detailedScores,
  };
}