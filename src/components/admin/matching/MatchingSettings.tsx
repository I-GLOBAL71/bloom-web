import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import type { MatchingWeights, MatchingPreferences } from '../../../types/matching';

const DEFAULT_WEIGHTS: MatchingWeights = {
  interestMatch: 0.25,
  distance: 0.20,
  activity: 0.10,
  photoQuality: 0.05,
  personalityMatch: 0.15,
  interactionHistory: 0.10,
  eventParticipation: 0.10,
  profileCompleteness: 0.05,
};

interface MatchingSettingsConfig {
  dealBreakers: {
    mustHavePhoto: boolean;
    minProfileCompletion: number;
    maxDistance: number;
    hasVerifiedProfile: boolean;
    noReports: boolean;
  };
  boostFactors: {
    verifiedProfile: number;
    premium: number;
    mutualConnections: number;
    activeInLastWeek: number;
  };
}

const DEFAULT_SETTINGS: MatchingSettingsConfig = {
  dealBreakers: {
    mustHavePhoto: true,
    minProfileCompletion: 0.5,
    maxDistance: 100,
    hasVerifiedProfile: false,
    noReports: true,
  },
  boostFactors: {
    verifiedProfile: 0.2,
    premium: 0.3,
    mutualConnections: 0.2,
    activeInLastWeek: 0.1,
  },
};

export default function MatchingSettings() {
  const [weights, setWeights] = useState<MatchingWeights>(DEFAULT_WEIGHTS);
  const [settings, setSettings] = useState<MatchingSettingsConfig>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadSettings = async () => {
      const settingsDoc = await getDoc(doc(db, 'settings', 'matching'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setWeights(data.weights || DEFAULT_WEIGHTS);
        setSettings({
          dealBreakers: { ...DEFAULT_SETTINGS.dealBreakers, ...data.dealBreakers },
          boostFactors: { ...DEFAULT_SETTINGS.boostFactors, ...data.boostFactors },
        });
      }
    };
    loadSettings();
  }, []);

  const handleWeightChange = (key: keyof MatchingWeights) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleDealBreakerChange = (key: keyof MatchingSettingsConfig['dealBreakers']) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : parseFloat(e.target.value);
    setSettings(prev => ({
      ...prev,
      dealBreakers: {
        ...prev.dealBreakers,
        [key]: value,
      },
    }));
  };

  const handleBoostFactorChange = (key: keyof MatchingSettingsConfig['boostFactors']) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setSettings(prev => ({
      ...prev,
      boostFactors: {
        ...prev.boostFactors,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      await setDoc(doc(db, 'settings', 'matching'), {
        weights,
        dealBreakers: settings.dealBreakers,
        boostFactors: settings.boostFactors,
        updatedAt: new Date(),
      });
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving matching settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Paramètres de Matching</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Poids des Facteurs de Matching</h2>
          <p className="text-sm text-gray-600 mb-4">
            Définissez l'importance relative de chaque facteur dans le calcul du score de matching.
            La somme doit être égale à 1.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {key}
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={value}
                  onChange={handleWeightChange(key as keyof MatchingWeights)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Critères Éliminatoires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.dealBreakers).map(([key, value]) => (
              <div key={key} className="flex items-center">
                {typeof value === 'boolean' ? (
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={handleDealBreakerChange(key as keyof typeof settings.dealBreakers)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{key}</span>
                  </label>
                ) : (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={handleDealBreakerChange(key as keyof typeof settings.dealBreakers)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Facteurs de Boost</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.boostFactors).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {key}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={value}
                  onChange={handleBoostFactorChange(key as keyof typeof settings.boostFactors)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          {saveStatus === 'success' && (
            <p className="text-green-600">Paramètres sauvegardés avec succès!</p>
          )}
          {saveStatus === 'error' && (
            <p className="text-red-600">Erreur lors de la sauvegarde</p>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </button>
        </div>
      </form>
    </div>
  );
}