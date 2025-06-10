import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Profile } from '../../dashboard/types';

interface SwipeAnimationProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeAnimation({ profile, onSwipe }: SwipeAnimationProps) {
  const controls = useAnimation();
  const swipeThreshold = 100;

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? 'right' : 'left';
      
      await controls.start({
        x: direction === 'right' ? 1000 : -1000,
        opacity: 0,
        rotate: direction === 'right' ? 30 : -30,
        transition: { duration: 0.5 }
      });

      onSwipe(direction);
    } else {
      controls.start({
        x: 0,
        opacity: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute inset-0"
      style={{ touchAction: 'none' }}
      whileDrag={{
        scale: 1.05,
        cursor: 'grabbing'
      }}
    >
      {/* Contenu du profil */}
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl">
        <img
          src={profile.photos[0]}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
          <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
          <p className="text-sm opacity-90">{profile.location}</p>
        </div>
      </div>
    </motion.div>
  );
}