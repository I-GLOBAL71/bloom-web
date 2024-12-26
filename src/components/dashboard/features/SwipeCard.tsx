import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../../lib/models/user';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useImageCache } from '../../../hooks/useImageCache';

interface SwipeCardProps {
  profile: UserProfile;
  direction: 'left' | 'right' | null;
}

export function SwipeCard({ profile, direction }: SwipeCardProps) {
  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  };

  const { getImage, preloadImages } = useImageCache();

  // Précharger l'image au montage du composant
  React.useEffect(() => {
    if (profile.photos?.length) {
      preloadImages(profile.photos);
    }
  }, [profile.photos, preloadImages]);

  const variants = {
    enter: { x: 0, opacity: 1 },
    center: { x: 0, opacity: 1 },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={direction}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl relative bg-white">
        {/* Image principale */}
        <div className="w-full h-full relative">
          <img
            src={profile.photos?.length > 0 ? getImage(profile.photos[0], profile.displayName) : '/default-profile.jpg'}
            alt={profile.displayName}
            className="w-full h-full object-cover"
          />
          
          {/* Dégradé pour le texte */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Informations du profil */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">
              {profile.displayName}, {calculateAge(profile.birthDate.toDate())}
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location.city}</span>
              </div>
              
              {profile.premium && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="mt-2 text-sm text-gray-200 line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}