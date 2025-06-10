import React from 'react';
import { Heart, X, Stars, Info } from 'lucide-react';
import { usePetalCosts } from '../../contexts/PetalCostsContext';
import type { AdvancedMatchingScore } from '../../types/matching';

interface ActionChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onReject: () => void;
  matchScore?: AdvancedMatchingScore;
}

export function ActionChoiceModal({
  isOpen,
  onClose,
  onLike,
  onReject,
  matchScore
}: ActionChoiceModalProps) {
  const { costs } = usePetalCosts();

  if (!isOpen) return null;

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-blue-500';
    if (score >= 0.4) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const formatScore = (score: number) => `${Math.round(score * 100)}%`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl">
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
          <Stars className="w-6 h-6 text-pink-500" />
          Score de Compatibilité
        </h3>

        {matchScore && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Score Global</h4>
              <p className={`text-2xl font-bold ${getCompatibilityColor(matchScore.score)}`}>
                {formatScore(matchScore.score)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Compatibilité Personnalité</h4>
              <p className={`text-2xl font-bold ${getCompatibilityColor(matchScore.personalityCompatibility)}`}>
                {formatScore(matchScore.personalityCompatibility)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <button
              onClick={onLike}
              className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              <Heart className="w-6 h-6" />
              <span className="font-medium">J'aime</span>
            </button>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={onReject}
              className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-gray-100 text-gray-600 rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              <X className="w-6 h-6" />
              <span className="font-medium">Passer</span>
            </button>
          </div>
        </div>

        {matchScore && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Détails du Match
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(matchScore.detailedScores).map(([key, score]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className={getCompatibilityColor(score)}>{formatScore(score)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 p-3 text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}