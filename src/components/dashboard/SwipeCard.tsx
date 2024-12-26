import React, { useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Briefcase, Heart, X } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  profession: string;
}

interface SwipeCardProps {
  profile: Profile;
  direction: 'left' | 'right' | null;
  onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeCard({ profile, direction, onSwipe }: SwipeCardProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for swipe animation
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const likeScale = useTransform(x, [0, 150], [1, 1.5]);
  const nopeScale = useTransform(x, [-150, 0], [1.5, 1]);
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0, 1, 0, 1, 0]
  );

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 80; // Réduire le seuil pour rendre le swipe plus réactif
    const swipeDirection = info.offset.x > swipeThreshold ? 'right' : 
                          info.offset.x < -swipeThreshold ? 'left' : null;
    
    if (swipeDirection) {
      onSwipe(swipeDirection);
    }
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhoto(prev => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhoto(prev => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  const variants = {
    enter: { x: 0, opacity: 1 },
    exit: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
      opacity: 0,
      transition: { duration: 0.3 }
    })
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 bg-white rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7} // Ajouter de l'élasticité au glissement
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      variants={variants}
      initial="enter"
      animate="enter"
      exit="exit"
      custom={direction}
      whileTap={{ scale: 1.02 }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Instructions de swipe */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-x-0 top-4 flex justify-center items-center text-white text-sm z-30 pointer-events-none"
      >
        <div className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
          Glissez vers la droite pour liker, vers la gauche pour passer
        </div>
      </motion.div>

      {/* Like/Nope Overlays */}
      <motion.div
        className="absolute top-8 right-8 bg-green-500 text-white px-6 py-2 rounded-full font-bold text-xl rotate-12 z-30"
        style={{ scale: likeScale, opacity }}
      >
        <Heart className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute top-8 left-8 bg-red-500 text-white px-6 py-2 rounded-full font-bold text-xl -rotate-12 z-30"
        style={{ scale: nopeScale, opacity }}
      >
        <X className="w-8 h-8" />
      </motion.div>

      {/* Photos */}
      <div className="relative h-3/4">
        <motion.img
          src={profile.photos[currentPhoto]}
          alt={`Photo de ${profile.name}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Photo Navigation */}
        <div className="absolute top-0 w-full h-full flex justify-between items-center px-4">
          <motion.button
            onClick={prevPhoto}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            onClick={nextPhoto}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Photo Indicators */}
        <div className="absolute top-4 w-full flex justify-center gap-1">
          {profile.photos.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentPhoto 
                  ? 'w-6 bg-white' 
                  : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <motion.div
        className={`absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white transition-all ${
          expanded ? 'h-2/3' : 'h-1/3'
        }`}
        animate={{ height: expanded ? '66.666667%' : '33.333333%' }}
      >
        <div className="h-full flex flex-col">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {profile.name}, {profile.age}
          </h2>
          
          <div className="flex items-center gap-4 mt-2 text-white/80">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{profile.profession}</span>
            </div>
          </div>

          <motion.div
            className="mt-4 flex-1 overflow-hidden"
            animate={{ opacity: expanded ? 1 : 0.6 }}
          >
            <p className="text-white/90 mb-4">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}