import React, { useState } from 'react';
import { Eye, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PrivacySettingsState {
  profileVisibility: 'public' | 'matches' | 'private';
  showLocation: boolean;
  showAge: boolean;
  showLastActive: boolean;
  allowMessages: 'all' | 'matches' | 'none';
}

export function PrivacySettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<PrivacySettingsState>({
    profileVisibility: 'public',
    showLocation: true,
    showAge: true,
    showLastActive: true,
    allowMessages: 'all'
  });

  const handleSave = async () => {
    // TODO: Save privacy settings
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{t('profile.settings.privacy.title')}</h2>
          <p className="text-sm text-gray-600">{t('profile.settings.privacy.subtitle')}</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <Save className="w-4 h-4" />
          <span>{t('profile.settings.notifications.saveChanges')}</span>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('profile.settings.privacy.visibility.title')}
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              profileVisibility: e.target.value as PrivacySettingsState['profileVisibility']
            }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
          >
            <option value="public">{t('profile.settings.privacy.visibility.public')}</option>
            <option value="matches">{t('profile.settings.privacy.visibility.matches')}</option>
            <option value="private">{t('profile.settings.privacy.visibility.private')}</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">{t('profile.settings.privacy.visibility.description')}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('profile.settings.privacy.show.title')}
          </h3>
          <div className="space-y-4">
            {[
              { id: 'showLocation', label: 'profile.settings.privacy.show.location' },
              { id: 'showAge', label: 'profile.settings.privacy.show.age' },
              { id: 'showLastActive', label: 'profile.settings.privacy.show.lastActive' }
            ].map(({ id, label }) => (
              <label key={id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings[id as keyof Pick<PrivacySettingsState, 'showLocation' | 'showAge' | 'showLastActive'>]}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    [id]: e.target.checked
                  }))}
                  className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="ml-3 text-sm text-gray-600">{t(label)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('profile.settings.privacy.messaging.title')}
          </label>
          <select
            value={settings.allowMessages}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              allowMessages: e.target.value as PrivacySettingsState['allowMessages']
            }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
          >
            <option value="all">{t('profile.settings.privacy.messaging.everyone')}</option>
            <option value="matches">{t('profile.settings.privacy.messaging.matches')}</option>
            <option value="none">{t('profile.settings.privacy.messaging.none')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}