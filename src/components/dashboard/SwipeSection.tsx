import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, MessageCircle, Undo2 } from 'lucide-react';
import { SwipeCard } from './SwipeCard';

// Sample profiles data
const sampleProfiles = [
  {
    id: '1',
    name: 'Sophie',
    age: 28,
    location: 'Paris',
    bio: 'Passionnée d\'art et de voyages ✈️\nJ\'aime découvrir de nouveaux endroits et capturer des moments uniques à travers mon objectif 📸',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'
    ],
    interests: ['Art', 'Voyages', 'Photographie', 'Musique', 'Cuisine'],
    profession: 'Architecte'
  },
  {
    id: '2',
    name: 'Emma',
    age: 25,
    location: 'Lyon',
    bio: 'Danseuse professionnelle 💃\nJ\'adore l\'art sous toutes ses formes. Toujours partante pour une nouvelle aventure !',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    interests: ['Danse', 'Théâtre', 'Mode', 'Fitness', 'Café'],
    profession: 'Danseuse'
  },
  {
    id: '3',
    name: 'Marie',
    age: 27,
    location: 'Bordeaux',
    bio: 'Sommelière passionnée 🍷\nJ\'aime partager ma passion pour le vin et la gastronomie. Amateur de bonnes conversations et de rires sincères.',
    photos: [
      'https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800',
      'https://images.unsplash.com/photo-1526080676457-4544bf0ebba9?w=800'
    ],
    interests: ['Vin', 'Gastronomie', 'Voyages', 'Culture', 'Nature'],
    profession: 'Sommelière'
  }
];

export function SwipeSection() {
  const [profiles, setProfiles] = useState(sampleProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [swipedProfiles, setSwipedProfiles] = useState<Array<{ profile: typeof sampleProfiles[0], direction: 'left' | 'right' }>>([]);

  const currentProfile = profiles[currentIndex];
  const canUndo = swipedProfiles.length > 0;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentProfile) return;

    setDirection(direction);
    setSwipedProfiles(prev => [...prev, { profile: currentProfile, direction }]);

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 300);
  };

  const handleUndo = () => {
    if (!canUndo) return;

    const previousProfile = swipedProfiles[swipedProfiles.length - 1].profile;
    setSwipedProfiles(prev => prev.slice(0, -1));
    setProfiles(prev => [previousProfile, ...prev.slice(currentIndex)]);
    setCurrentIndex(prev => prev - 1);
  };

  // Reset when we run out of profiles
  useEffect(() => {
    if (currentIndex >= profiles.length) {
      setProfiles(sampleProfiles);
      setCurrentIndex(0);
    }
  }, [currentIndex, profiles.length]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="relative w-full max-w-lg aspect-[3/4]">
        <AnimatePresence mode="wait">
          {currentProfile && (
            <SwipeCard
              key={currentProfile.id}
              profile={currentProfile}
              direction={direction}
              onSwipe={handleSwipe}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center gap-6">
        <motion.button
          onClick={() => handleSwipe('left')}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-8 h-8 text-red-500" />
        </motion.button>

        <motion.button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-4 bg-white rounded-full shadow-lg hover:shadow-xl ${
            !canUndo ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={canUndo ? { scale: 1.1 } : undefined}
          whileTap={canUndo ? { scale: 0.9 } : undefined}
        >
          <Undo2 className="w-8 h-8 text-amber-500" />
        </motion.button>

        <motion.button
          onClick={() => handleSwipe('right')}
          className="p-6 bg-gradient-to-r from-amber-400 to-pink-500 rounded-full shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="w-10 h-10 text-white" />
        </motion.button>

        <motion.button
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star className="w-8 h-8 text-amber-400" />
        </motion.button>
      </div>
    </div>
  );
}