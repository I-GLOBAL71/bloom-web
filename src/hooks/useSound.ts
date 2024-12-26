import { useCallback } from 'react';

export function useSound() {
  const playMatchSound = useCallback(() => {
    const audio = new Audio('/sounds/match.mp3');
    audio.play().catch(() => {
      // Gérer l'erreur silencieusement si l'autoplay est bloqué
    });
  }, []);

  const playMessageSound = useCallback(() => {
    const audio = new Audio('/sounds/message.mp3');
    audio.play().catch(() => {
      // Gérer l'erreur silencieusement si l'autoplay est bloqué
    });
  }, []);

  return {
    playMatchSound,
    playMessageSound
  };
}