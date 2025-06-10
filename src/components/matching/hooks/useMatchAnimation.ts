import { useState, useCallback } from 'react';
import { useCreditStore } from '../../credits/store/creditStore';
import { useSound } from '../../hooks/useSound';

export function useMatchAnimation() {
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const { playMatchSound } = useSound();
  const { spendPetals } = useCreditStore();

  const handleMatch = useCallback(async () => {
    setShowMatchAnimation(true);
    playMatchSound();
    
    // Dépenser des pétales pour le match
    spendPetals(5, 'Nouveau match');

    // Fermer l'animation après 3 secondes
    setTimeout(() => {
      setShowMatchAnimation(false);
    }, 3000);
  }, [playMatchSound, spendPetals]);

  return {
    showMatchAnimation,
    handleMatch,
    setShowMatchAnimation
  };
}