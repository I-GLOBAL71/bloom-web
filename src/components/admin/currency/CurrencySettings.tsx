import React, { useState } from 'react';
import { Leaf, Save, AlertCircle } from 'lucide-react';
import { RoseIcon } from '../../ui/RoseIcon';

interface CurrencyOperation {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'petal';
}

const DEFAULT_OPERATIONS: CurrencyOperation[] = [
  {
    id: 'message',
    name: 'Send Message',
    description: 'Cost to send first message to a user',
    cost: 5,
    type: 'petal'
  },
  {
    id: 'contact',
    name: 'Request Contact',
    description: 'Cost to request contact information',
    cost: 10,
    type: 'petal'
  },
  {
    id: 'event_create',
    name: 'Create Event',
    description: 'Cost to create a new event',
    cost: 20,
    type: 'petal'
  }
];

export function CurrencySettings() {
  const [operations, setOperations] = useState(DEFAULT_OPERATIONS);
  const [exchangeRate, setExchangeRate] = useState(100); // 100 petals = 1 flower
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

  const updateOperationCost = (id: string, newCost: number) => {
    setOperations(prev =>
      prev.map(op =>
        op.id === id ? { ...op, cost: newCost } : op
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Currency Settings</h2>
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

      {/* Exchange Rate */}
      <div className="p-4 rounded-lg bg-pink-50 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white">
            <RoseIcon size={20} />
          </div>
          <h3 className="font-medium text-gray-900">Exchange Rate</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(parseInt(e.target.value) || 0)}
            min="1"
            className="w-24 px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
          />
          <span className="text-gray-600">petals = 1 flower</span>
        </div>
      </div>

      {/* Operation Costs */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Operation Costs</h3>
        
        <div className="space-y-4">
          {operations.map((operation) => (
            <div
              key={operation.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-50">
                  <Leaf className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{operation.name}</p>
                  <p className="text-sm text-gray-600">{operation.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={operation.cost}
                  onChange={(e) => updateOperationCost(operation.id, parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-20 px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
                <span className="text-gray-600">petals</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}