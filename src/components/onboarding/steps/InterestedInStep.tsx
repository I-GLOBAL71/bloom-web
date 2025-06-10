import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { StepCard } from '../StepCard';

interface InterestedInStepProps {
  onNext: (data: { interestedIn: string[] }) => void;
  initialValue: string[];
  onBack?: () => void;
}

const options = [
  { id: 'rose', label: 'Roses', description: 'Women' },
  { id: 'bumblebee', label: 'Bumblebees', description: 'Men' },
  { id: 'garden', label: 'Gardens', description: 'Non-binary people' },
  { id: 'all', label: 'All Flowers', description: 'Everyone' }
];

export function InterestedInStep({ onNext, initialValue, onBack }: InterestedInStepProps) {
  const [selected, setSelected] = useState<string[]>(initialValue);
  const [error, setError] = useState('');

  const toggleOption = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
    setError('');
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setError('Please select at least one option');
      return;
    }
    onNext({ interestedIn: selected });
  };

  return (
    <StepCard
      icon={Heart}
        title="Who interests you?"
        subtitle="Select all that apply"
        onBack={onBack}>
      <div className="space-y-6">
        <div className="grid gap-3">
          {options.map(({ id, label, description }) => (
            <button
              key={id}
              onClick={() => toggleOption(id)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4
                ${selected.includes(id)
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-amber-100 hover:border-amber-200'}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                <Heart 
                  className={`w-6 h-6 ${selected.includes(id) ? 'text-rose-500' : 'text-amber-500'}`}
                  fill={selected.includes(id) ? 'currentColor' : 'none'}
                />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-rose-500">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-xl font-medium hover:from-amber-500 hover:to-rose-500 transition-colors"
        >
          Continue
        </button>
      </div>
    </StepCard>
  );
}
