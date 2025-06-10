import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../../types';
import type { AdvancedMatchingScore } from '../../types/matching';
import { Stars, Heart, X, ChevronUp, MessageCircle, Phone, ThumbsUp, MoreHorizontal, ThumbsDown } from 'lucide-react';
import { UserFullProfile } from './UserFullProfile';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';

interface SwipeCardProps {
  user: User;
  score: AdvancedMatchingScore;
  onSwipe: (action: 'like' | 'dislike' | 'message' | 'contact', user: User) => void;
}

export function SwipeCard({ user, score, onSwipe }: SwipeCardProps) {
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Assurer que le profil se ferme si on swipe pendant qu'il est ouvert
  useEffect(() => {
    if (isInteracting && showFullProfile) {
      setShowFullProfile(false);
    }
  }, [isInteracting, showFullProfile]);

  const handleProfileClick = () => {
    if (!isInteracting) {
      setShowFullProfile(true);
    }
  };

  // Transformations pour les indicateurs visuels
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const likeOpacity = useTransform(x, [-200, 0], [1, 0]);
  const dislikeOpacity = useTransform(x, [0, 200], [0, 1]);
  const actionOpacity = useTransform(y, [-200, 0], [1, 0]);

  const handleActionChoice = (action: 'message' | 'contact') => {
    setShowActionMenu(false);
    onSwipe(action === 'message' ? 'message' : 'contact', user);
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    try {
      setIsInteracting(false);
      const threshold = 100;
      const velocity = 500;
      
      const offsetX = info.offset.x;
      const offsetY = info.offset.y;
      const velocityX = info.velocity.x;
      const velocityY = info.velocity.y;
      
      if (Math.abs(offsetY) > threshold && offsetY < 0 && Math.abs(velocityY) > velocity) {
        // Swipe vers le haut - Afficher le menu d'actions
        setShowActionMenu(true);
        await controls.start({
          y: 0,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        });
      } else if (Math.abs(offsetX) > threshold && Math.abs(velocityX) > velocity) {
        // Swipe gauche (like) / droite (dislike)
        const action = offsetX > 0 ? 'like' : 'dislike';
        await controls.start({
          x: offsetX < 0 ? -1000 : 1000,
          transition: { duration: 0.3 }
        });
        await new Promise(resolve => setTimeout(resolve, 50));
        onSwipe(action, user);
      } else {
        // Retour à la position initiale
        await controls.start({
          x: 0,
          y: 0,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'animation de drag:', error);
      // En cas d'erreur, on essaie de revenir à la position initiale
      await controls.start({
        x: 0,
        y: 0,
        transition: { type: "spring", stiffness: 500, damping: 30 }
      });
    }
  };

  // Gérer l'échap pour fermer le menu d'actions
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowActionMenu(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-blue-500';
    if (score >= 0.4) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const formatScore = (score: number) => `${Math.round(score * 100)}%`;

  return (
    <>
      <motion.div
        ref={cardRef}
        className="relative h-[70vh] w-full rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ x, y, rotate }}
        animate={controls}
        drag={true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={() => setIsInteracting(true)}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05 }}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
      >
        {/* Indicateurs d'action */}
        <motion.div
          className="absolute top-10 right-10 bg-gradient-to-r from-pink-400/90 to-pink-600/90 backdrop-blur-sm text-white p-6 rounded-2xl font-bold z-20 shadow-lg flex items-center gap-3"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-lg tracking-wide">Like</span>
          <ThumbsUp className="w-8 h-8" />
        </motion.div>

        <motion.div
          className="absolute top-10 left-10 bg-gradient-to-r from-zinc-400/90 to-zinc-500/90 backdrop-blur-sm text-white p-6 rounded-2xl font-bold z-20 shadow-lg flex items-center gap-3"
          style={{ opacity: dislikeOpacity }}
        >
          <ThumbsDown className="w-8 h-8" />
          <span className="text-lg tracking-wide">Pass</span>
        </motion.div>

        <motion.div
          className="absolute top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-rose-500 text-white p-6 rounded-2xl font-bold z-20 shadow-xl flex items-center gap-4"
          style={{ opacity: actionOpacity }}
        >
          <MoreHorizontal className="w-8 h-8" />
          <span className="text-lg tracking-wide">Interagir</span>
        </motion.div>

        {/* Menu d'actions */}
       {showActionMenu && (
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9 }}
           className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex items-center justify-center"
         >
           <motion.div
             initial={{ y: 20 }}
             animate={{ y: 0 }}
             className="bg-white rounded-3xl p-6 shadow-2xl w-80"
           >
             <h3 className="text-center text-xl font-bold text-gray-900 mb-5">
               Comment souhaitez-vous interagir ?
             </h3>
             <div className="space-y-4">
               <button
                 onClick={() => handleActionChoice('message')}
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
               <button
                 onClick={() => handleActionChoice('contact')}
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
             </div>
             <button
               onClick={() => setShowActionMenu(false)}
               className="mt-6 w-full flex items-center justify-center gap-2 text-gray-600 py-3 hover:text-gray-800 transition-colors rounded-xl hover:bg-gray-100 font-semibold"
             >
               <X className="w-5 h-5" />
               <span>Fermer le menu</span>
             </button>
           </motion.div>
         </motion.div>
       )}

        <div
          className="w-full h-full relative cursor-pointer"
          onClick={handleProfileClick}
        >
          <img
            src={user.photoURL || user.photos?.[0]}
            className="w-full h-full object-cover"
            alt={`Photo de ${user.name}`}
            style={{ pointerEvents: 'none' }}
          />
        </div>

        {/* Overlay avec les informations et boutons */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient overlay pour le texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Informations utilisateur */}
            <div className="space-y-2 pointer-events-none">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {user.name}
                {user.isVerified && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Vérifié</span>
                )}
              </h2>
              <p className="text-gray-200">
                {user.birthDate ? `${new Date().getFullYear() - new Date(user.birthDate).getFullYear()} ans` : ''}{user.profession ? ` • ${user.profession}` : ''}
              </p>
              {user.bio && (
                <p className="text-gray-300 text-sm line-clamp-2">{user.bio}</p>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="mt-4 flex justify-around text-xs tracking-wide pointer-events-auto">
             <button
                onClick={async () => {
                  try {
                    await controls.start({
                      x: -1000,
                      transition: { duration: 0.3 }
                    });
                    // Ajouter un petit délai pour laisser l'animation se terminer visuellement
                    await new Promise(resolve => setTimeout(resolve, 50));
                    onSwipe('like', user);
                  } catch (error) {
                    console.error('Erreur lors de l\'animation:', error);
                  }
                }}
                className="flex flex-col items-center gap-2 group"
              >
               <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-400/20 to-pink-600/20 group-hover:from-pink-400 group-hover:to-pink-600 transition-all duration-300">
                 <ThumbsUp className="w-5 h-5 text-pink-300 group-hover:text-white transition-colors" />
               </span>
               <p className="text-pink-300/70 uppercase font-light tracking-wider group-hover:text-pink-300 transition-colors">Like</p>
             </button>
             <button
               onClick={() => setShowActionMenu(true)}
               className="flex flex-col items-center gap-2 group"
             >
               <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-400/20 to-rose-500/20 group-hover:from-amber-400 group-hover:to-rose-500 transition-all duration-300">
                 <MoreHorizontal className="w-5 h-5 text-amber-200 group-hover:text-white transition-colors" />
               </span>
               <p className="text-amber-200/70 uppercase font-light tracking-wider group-hover:text-amber-200 transition-colors">Interagir</p>
             </button>
             <button
               onClick={async () => {
                 try {
                   await controls.start({
                     x: 1000,
                     transition: { duration: 0.3 }
                   });
                   await new Promise(resolve => setTimeout(resolve, 50));
                   onSwipe('dislike', user);
                 } catch (error) {
                   console.error('Erreur lors de l\'animation:', error);
                 }
               }}
               className="flex flex-col items-center gap-2 group"
             >
               <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-zinc-400/20 to-zinc-500/20 group-hover:from-zinc-400 group-hover:to-zinc-500 transition-all duration-300">
                 <ThumbsDown className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
               </span>
               <p className="text-zinc-400/70 uppercase font-light tracking-wider group-hover:text-zinc-300 transition-colors">Pass</p>
             </button>
           </div>
          </div>
        </div>

        {/* Badge boost si applicable */}
        {score.boostMultiplier > 1 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
            <Stars className="w-4 h-4" />
            Boost {score.boostMultiplier.toFixed(1)}x
          </div>
        )}
      </motion.div>

      {/* Affichage du profil complet */}
      {showFullProfile && (
        <UserFullProfile
          user={user}
          score={score}
          onBack={() => setShowFullProfile(false)}
          onContactRequest={(user) => {
            setShowFullProfile(false);
            onSwipe('contact', user);
          }}
          onMessageRequest={(user) => {
            setShowFullProfile(false);
            onSwipe('message', user);
          }}
        />
      )}
    </>
  );
}