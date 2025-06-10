import React, { useState } from 'react';
import { Lock, Shield, Save, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SecuritySettings() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('errors.required'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('profile.settings.security.password.errors.mismatch'));
      return;
    }

    try {
      // TODO: Change password
      setError(undefined);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(t('profile.settings.security.password.errors.changeFailed'));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{t('profile.settings.security.title')}</h2>
          <p className="text-sm text-gray-600">{t('profile.settings.security.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Change Password */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('profile.settings.security.password.title')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                {t('profile.settings.security.password.current')}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                {t('profile.settings.security.password.new')}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                {t('profile.settings.security.password.confirm')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleChangePassword}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              <Save className="w-4 h-4" />
              <span>{t('profile.settings.security.password.changeButton')}</span>
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('profile.settings.security.twoFactor.title')}
          </h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{t('profile.settings.security.twoFactor.title')}</p>
                <p className="text-sm text-gray-600">{t('profile.settings.security.twoFactor.description')}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {t('profile.settings.security.twoFactor.enable')}
            </button>
          </div>
        </div>

        {/* Account Activity */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('profile.settings.security.activity.title')}
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-900">{t('profile.settings.security.activity.lastLogin')}</p>
              <p className="text-sm text-gray-600">Today, 10:30 AM</p>
              <p className="text-xs text-gray-500 mt-1">Paris, France</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-900">{t('profile.settings.security.activity.passwordChanged')}</p>
              <p className="text-sm text-gray-600">2 weeks ago</p>
              <p className="text-xs text-gray-500 mt-1">Paris, France</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
