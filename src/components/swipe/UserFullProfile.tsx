import React from 'react';
import type { User } from '../../types';
import type { AdvancedMatchingScore } from '../../types/matching';
import { ArrowLeft, Stars, MessageCircle, Phone } from 'lucide-react';

interface UserFullProfileProps {
  user: User;
  score?: AdvancedMatchingScore;
  onBack: () => void;
  onContactRequest?: (user: User) => void;
  onMessageRequest?: (user: User) => void;
}

export function UserFullProfile({
  user,
  score,
  onBack,
  onContactRequest,
  onMessageRequest
}: UserFullProfileProps) {
  console.log('UserFullProfile rendered with user:', user);
  console.log('Score:', score);
  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-blue-500';
    if (score >= 0.4) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const formatScore = (score: number) => `${Math.round(score * 100)}%`;
  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Bouton retour */}
        <button 
          onClick={onBack}
          className="mb-6 text-white flex items-center gap-2 hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au swipe</span>
        </button>

        {/* Galerie photos */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {user.photos?.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Photo ${index + 1} de ${user.name}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Informations principales */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {user.isVerified && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Vérifié
              </span>
            )}
          </div>
          <div className="space-y-4">
            <p className="text-xl text-gray-300">
              {user.age} ans • {user.profession}
              {user.location && ` • ${user.location.city}, ${user.location.country}`}
            </p>
            {user.bio && <p className="text-gray-300">{user.bio}</p>}
          </div>
        </div>

        {/* Score de compatibilité */}
        {score && (
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Stars className="w-6 h-6 text-pink-400" />
                <h2 className="text-xl font-semibold">Score de Compatibilité</h2>
              </div>
              <span className={`text-3xl font-bold ${getCompatibilityColor(score.score)}`}>
                {formatScore(score.score)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-gray-300 mb-2">Personnalité</h3>
                <span className={`text-xl font-semibold ${getCompatibilityColor(score.personalityCompatibility)}`}>
                  {formatScore(score.personalityCompatibility)}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-gray-300 mb-2">Interactions</h3>
                <span className={`text-xl font-semibold ${getCompatibilityColor(score.interactionScore)}`}>
                  {formatScore(score.interactionScore)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Informations détaillées */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm text-white">
          <h2 className="text-xl font-semibold mb-4">Plus d'informations</h2>
          <div className="space-y-4">
            {user.interests && (
              <div>
                <h3 className="text-pink-400 mb-2">Centres d'intérêt</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {user.education && (
              <div>
                <h3 className="text-pink-400 mb-2">Formation</h3>
                <p className="text-gray-300">{user.education}</p>
              </div>
            )}
          </div>
  
          {/* Menu d'actions persistant */}
          <div className="mt-8 bg-white rounded-3xl p-6 shadow-2xl">
            <h3 className="text-center text-xl font-bold text-gray-900 mb-5">
              Interagir avec {user.name}
            </h3>
            <div className="space-y-4">
              {onMessageRequest && (
                <button
                  onClick={() => onMessageRequest(user)}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-400 to-rose-500 p-5 rounded-xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-amber-400/25"
                >
                  <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/30">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-white font-bold text-xl tracking-wide">Message privé</span>
                    <span className="text-white text-base mt-0.5">Démarrer une conversation</span>
                  </div>
                </button>
              )}
  
              {onContactRequest && (
                <button
                  onClick={() => onContactRequest(user)}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-rose-400 to-amber-500 p-5 rounded-xl flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-rose-400/25"
                >
                  <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/30">
                    <Phone className="w-7 h-7 text-white" />
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-white font-bold text-xl tracking-wide">Rencontre directe</span>
                    <span className="text-white text-base mt-0.5">Demander son numéro</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}