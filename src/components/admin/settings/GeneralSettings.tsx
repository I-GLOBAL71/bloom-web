import React from 'react';
import { usePetalCosts } from '../../../contexts/PetalCostsContext';

export function GeneralSettings() {
  const { costs, updateCosts } = usePetalCosts();

  const handlePetalCostChange = (action: keyof typeof costs, value: string) => {
    const numValue = parseInt(value) || 0;
    updateCosts({
      ...costs,
      [action]: numValue
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">General Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter application name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="UTC">UTC</option>
            {/* TODO: Add more timezone options */}
          </select>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="text-lg font-medium mb-4">Coûts en Pétales</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Demande de contact
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="1"
                  value={costs.contactRequest}
                  onChange={(e) => handlePetalCostChange('contactRequest', e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">pétales</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Envoi de message
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="1"
                  value={costs.sendMessage}
                  onChange={(e) => handlePetalCostChange('sendMessage', e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">pétales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-rose-400 to-amber-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
}
