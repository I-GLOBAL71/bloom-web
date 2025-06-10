import React, { useState } from 'react';
import { 
  User, MapPin, Briefcase, Heart, Calendar,
  Mail, Phone, Edit2, Save, X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User as UserType } from '../../types';

interface ProfileInfoProps {
  user: UserType;
  onEdit: () => void;
}

export function ProfileInfo({ user, onEdit }: ProfileInfoProps) {
  const { t } = useTranslation('common');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    profession: user.profession,
    interests: user.interests
  });

  const handleSave = async () => {
    try {
      // TODO: Update user profile
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">{t('profile.sections.about')}</h2>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={t('profile.actions.cancel')}
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-500 hover:text-green-600"
                  title={t('profile.actions.save')}
                >
                  <Save className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title={t('profile.actions.edit')}
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.fields.name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.fields.bio')}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.fields.city')}
                  </label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.fields.country')}
                  </label>
                  <input
                    type="text"
                    value={formData.location.country}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, country: e.target.value }
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.fields.profession')}
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600">{user.bio}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{t('profile.fields.location')}</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {user.location.city}, {user.location.country}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{t('profile.fields.profession')}</span>
                  </div>
                  <p className="font-medium text-gray-900">{user.profession}</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{t('profile.fields.age')}</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {t('profile.info.age', { age: user.age })}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Heart className="w-4 h-4" />
                    <span>{t('profile.fields.interests')}</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {t('profile.info.sharedInterests', { count: user.interests.length })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('profile.sections.interests')}</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('profile.sections.contact')}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('profile.fields.email')}</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('profile.fields.phone')}</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('profile.sections.account')}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('profile.fields.status')}</p>
                <p className="font-medium text-gray-900">
                  {t(user.premium ? 'profile.status.premium' : 'profile.status.free')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}