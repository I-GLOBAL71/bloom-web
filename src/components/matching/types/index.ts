export interface MatchScore {
  total: number;
  details: {
    interests: number;
    location: number;
    preferences: number;
    emotional: number;
  };
}

export interface MatchResult {
  matched: boolean;
  score: MatchScore;
  matchedOn: string[];
}

export interface MatchPreferences {
  minAge: number;
  maxAge: number;
  distance: number;
  relationshipType: string[];
  dealBreakers: string[];
}