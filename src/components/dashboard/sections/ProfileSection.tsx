import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Edit2 } from 'lucide-react';

export function ProfileSection() {
  return (
    <div className="space-y-8">
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <User className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold">Profil</h1>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Photo de profil */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="relative mx-auto w-48 h-48">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                alt="Photo de profil"
                className="w-full h-full rounded-xl object-cover"
              />
              <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Edit2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Nom</label>
                <p className="font-medium">Sarah Martin</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Âge</label>
                <p className="font-medium">28 ans</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Ville</label>
                <p className="font-medium">Paris</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Bio</label>
                <p className="font-medium">Passionnée de photographie et de voyages. J'aime découvrir de nouveaux endroits et capturer des moments uniques.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
