import { useState, useCallback } from 'react';
import { Profile } from '../../dashboard/types';
import { determineMatch } from '../services/matchingAlgorithm';
import { MatchResult } from '../types';
import { useCreditStore } from '../../credits/store/creditStore';
import { SPENDING_ACTIONS } from '../../credits/hooks/useSpendPetals';

export function useMatching() {
  const [currentMatch, setCurrentMatch] = useState<MatchResult | null>(null);
  const { spendPetals } = useCreditStore();

  const processSwipe = useCallback(async (
    userProfile: Profile,
    targetProfile: Profile,
    direction: 'left' | 'right'
  ) => {
    if (direction === 'right') {
      const matchResult = determineMatch(userProfile, targetProfile);
      setCurrentMatch(matchResult);

      if (matchResult.matched) {
        // Dépenser des pétales pour le match
        spendPetals(SPENDING_ACTIONS.MATCH.cost, 'Nouveau match');
        return matchResult;
      }
    }

    setCurrentMatch(null);
    return null;
  }, [spendPetals]);

  return {
    currentMatch,
    processSwipe
  };
}