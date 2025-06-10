import React, { useState } from 'react';
import { Percent, Save, AlertCircle } from 'lucide-react';

interface CommissionRule {
  id: string;
  name: string;
  description: string;
  rate: number;
}

const DEFAULT_RULES: CommissionRule[] = [
  {
    id: 'event_fee',
    name: 'Event Entry Fee',
    description: 'Commission on event entry fees',
    rate: 10
  },
  {
    id: 'flower_gift',
    name: 'Flower Gifts',
    description: 'Commission on flower gifts between users',
    rate: 5
  },
  {
    id: 'event_organizer',
    name: 'Event Organizer',
    description: 'Commission on organizer earnings',
    rate: 15
  }
];

export function CommissionSettings() {
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(undefined);
      // TODO: Implement save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateCommissionRate = (id: string, newRate: number) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === id ? { ...rule, rate: Math.min(100, Math.max(0, newRate)) } : rule
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Commission Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Percent className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{rule.name}</p>
                <p className="text-sm text-gray-600">{rule.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={rule.rate}
                onChange={(e) => updateCommissionRate(rule.id, parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="w-20 px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-600">
        <p>
          Note: Commission rates are applied to the total transaction amount and are
          automatically deducted before funds are distributed to users.
        </p>
      </div>
    </div>
  );
}