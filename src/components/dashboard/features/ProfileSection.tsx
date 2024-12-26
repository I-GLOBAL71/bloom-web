import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit2, MapPin, Heart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProfileSection() {
  const { t } = useTranslation();

  const profile = {
    name: 'Sophie',
    age: 28,
    location: 'Paris',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'
    ],
    bio: 'Passionnée d\'art et de voyages ✈️',
    interests: ['Art', 'Voyages', 'Photographie', 'Musique', 'Nature']
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-2xl mx-auto">
        {/* Photos Section */}
        <div className="relative mb-6">
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src={profile.photos[0]}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.button
            className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Camera className="w-6 h-6 text-pink-500" />
          </motion.button>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </div>
            <motion.button
              className="p-2 hover:bg-pink-50 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit2 className="w-5 h-5 text-pink-500" />
            </motion.button>
          </div>

          <p className="text-gray-700 mb-6">{profile.bio}</p>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5" />
            <span>Voir mes matchs</span>
          </motion.button>
          <motion.button
            className="flex items-center justify-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}