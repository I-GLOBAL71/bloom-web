import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface EventRatingProps {
  eventId: string;
  initialRating?: number;
  onRate: (eventId: string, rating: number) => Promise<void>;
}

export function EventRating({ eventId, initialRating, onRate }: EventRatingProps) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRate = async (value: number) => {
    if (loading) return;

    try {
      setLoading(true);
      setIsAnimating(true);
      await onRate(eventId, value);
      setRating(value);
    } catch (error) {
      console.error('Échec de la notation:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className="flex items-center gap-1 relative">
      {/* Feedback tooltip */}
      {isAnimating && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded-full opacity-0 animate-fade-up">
          Note enregistrée !
        </div>
      )}

      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          onClick={() => handleRate(value)}
          onMouseEnter={() => setHoveredRating(value)}
          onMouseLeave={() => setHoveredRating(0)}
          disabled={loading}
          className={`p-1 transition-transform duration-200 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            ${isAnimating && value <= rating ? 'animate-bounce-small' : ''}
          `}
          title={`Noter ${value} étoile${value > 1 ? 's' : ''}`}
        >
          <Star
            className={`w-5 h-5 transition-all duration-200 ${
              (hoveredRating ? value <= hoveredRating : value <= rating)
                ? 'text-yellow-400 fill-current transform rotate-0'
                : 'text-gray-300 transform rotate-0'
            } ${
              hoveredRating === value
                ? 'scale-110 rotate-12'
                : ''
            }`}
          />
        </button>
      ))}

      {/* Rating label */}
      {rating > 0 && (
        <span className="ml-2 text-xs text-gray-500">
          {rating}/5
        </span>
      )}
    </div>
  );
}

// Ajout des styles Tailwind personnalisés
const styles = `
  @keyframes bounce-small {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }

  @keyframes fade-up {
    0% { opacity: 0; transform: translate(-50%, 0); }
    50% { opacity: 1; transform: translate(-50%, -4px); }
    100% { opacity: 0; transform: translate(-50%, -8px); }
  }

  .animate-bounce-small {
    animation: bounce-small 0.3s ease-in-out;
  }

  .animate-fade-up {
    animation: fade-up 0.6s ease-out forwards;
  }
`;

// Injection des styles dans le document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}