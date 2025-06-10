import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function NotificationSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    messages: true,
    matches: true,
    likes: true,
    events: true,
    email: true,
    push: true
  });

  const handleSave = async () => {
    // TODO: Save notification settings
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{t('profile.settings.notifications.title')}</h2>
          <p className="text-sm text-gray-600">{t('profile.settings.notifications.subtitle')}</p>
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
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('profile.settings.notifications.sections.notifyAbout')}
          </h3>
          <div className="space-y-4">
            {[
              { id: 'messages', label: 'profile.settings.notifications.options.newMessages' },
              { id: 'matches', label: 'profile.settings.notifications.options.newMatches' },
              { id: 'likes', label: 'profile.settings.notifications.options.profileLikes' },
              { id: 'events', label: 'profile.settings.notifications.options.upcomingEvents' }
            ].map(({ id, label }) => (
              <label key={id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings[id as keyof typeof settings]}
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
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('profile.settings.notifications.sections.methods')}
          </h3>
          <div className="space-y-4">
            {[
              { id: 'email', label: 'profile.settings.notifications.options.emailNotifs' },
              { id: 'push', label: 'profile.settings.notifications.options.pushNotifs' }
            ].map(({ id, label }) => (
              <label key={id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings[id as keyof typeof settings]}
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
      </div>
    </div>
  );
}