import { Profile } from '../../dashboard/types';
import { MatchScore, MatchResult } from '../types';

export function calculateMatchScore(profile1: Profile, profile2: Profile): MatchScore {
  // Calcul du score basé sur les intérêts communs
  const commonInterests = profile1.interests.filter(interest =>
    profile2.interests.includes(interest)
  );
  const interestsScore = (commonInterests.length / Math.max(profile1.interests.length, profile2.interests.length)) * 100;

  // Calcul du score de proximité (à implémenter avec une vraie API de géolocalisation)
  const locationScore = calculateLocationScore(profile1.location, profile2.location);

  // Score de préférences (à enrichir avec plus de critères)
  const preferencesScore = 75; // Exemple statique pour le moment

  // Score de compatibilité émotionnelle (à enrichir avec l'IA)
  const emotionalScore = 80; // Exemple statique pour le moment

  return {
    total: Math.round((interestsScore + locationScore + preferencesScore + emotionalScore) / 4),
    details: {
      interests: Math.round(interestsScore),
      location: Math.round(locationScore),
      preferences: Math.round(preferencesScore),
      emotional: Math.round(emotionalScore)
    }
  };
}

function calculateLocationScore(location1: string, location2: string): number {
  // Simulation - À remplacer par une vraie logique de calcul de distance
  return location1 === location2 ? 100 : 50;
}

export function determineMatch(profile1: Profile, profile2: Profile): MatchResult {
  const score = calculateMatchScore(profile1, profile2);
  const matchedOn = [];

  if (score.details.interests >= 70) matchedOn.push('interests');
  if (score.details.location >= 80) matchedOn.push('location');
  if (score.details.preferences >= 75) matchedOn.push('preferences');
  if (score.details.emotional >= 80) matchedOn.push('emotional');

  return {
    matched: score.total >= 75,
    score,
    matchedOn
  };
}