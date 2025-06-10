export interface UserPreferences {
  interestedIn: ('rose' | 'bumblebee' | 'garden')[];
  interests: string[];
  location: {
    city: string;
    country: string;
  };
  ageRange: {
    min: number;
    max: number;
  };
}

export interface RecommendationScore {
  userId: string;
  score: number;
  matchingInterests: string[];
  distance: number;
}

export interface RecommendationFilters {
  maxDistance?: number; // in kilometers
  minAge?: number;
  maxAge?: number;
  mustHavePhoto?: boolean;
  onlineOnly?: boolean;
  withInterests?: string[];
}