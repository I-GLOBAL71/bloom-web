import React, { useState } from 'react';
import { Camera, MapPin, Briefcase, Heart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PhotoUpload } from './PhotoUpload';
import { ProfileInfo } from './ProfileInfo';
import { UserSettings } from '../settings/UserSettings';
import { useAuth } from '../../contexts/AuthContext';
import type { User as AppUser } from '../../types';

export function UserProfile() {
  const { t } = useTranslation('common');
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  if (!authUser) return null;

  // Préparer les données utilisateur avec des valeurs par défaut
  const defaultPhoto = authUser.photoURL || '';
  const defaultName = authUser.name || authUser.displayName || 'N/A';
  
  // Convertir l'utilisateur authentifié en profil utilisateur compatible
  const user: AppUser = {
    id: authUser.id,
    name: defaultName,
    photoURL: defaultPhoto,
    // Champs obligatoires avec valeurs par défaut
    photos: [defaultPhoto],
    location: { city: 'N/A', country: 'N/A' },
    profession: 'N/A',
    interests: [], // Tableau vide par défaut
    bio: '',
    email: authUser.email || '',
    hasCompletedOnboarding: authUser.hasCompletedOnboarding,
    // Champs optionnels avec valeurs par défaut
    phone: authUser.phoneNumber || undefined,
    isPremium: false,
    isVerified: false,
    petals: 0,
    flowers: 0
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pink-400 to-rose-400" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 -mt-16">
            <div className="relative">
              <img
                src={user.photos?.[0] || user.photoURL || '/default-avatar.png'}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                title={t('profile.actions.changePhoto')}
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {user.location?.city || 'N/A'}, {user.location?.country || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{user.profession || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>
                    {t('profile.info.sharedInterests', { count: user.interests?.length || 0 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'profile'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('profile.tabs.profile')}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t('profile.tabs.settings')}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'profile' ? (
        <ProfileInfo user={user} onEdit={() => setIsEditing(true)} />
      ) : (
        <UserSettings user={user} />
      )}

      {/* Photo Upload Modal */}
      {isEditing && (
        <PhotoUpload
          currentPhotos={user.photos || []}
          onClose={() => setIsEditing(false)}
          onSave={async (photos) => {
            // TODO: Update user photos
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}