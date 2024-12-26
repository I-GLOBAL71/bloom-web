import React from 'react';
import { motion } from 'framer-motion';
import { User2, UserCircle2, Users } from 'lucide-react';

interface ProfileType {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const profileTypes: ProfileType[] = [
  {
    id: 'rose',
    label: 'Une Rose',
    description: 'Femme (cis ou trans)',
    icon: <UserCircle2 className="w-4 h-4" />
  },
  {
    id: 'bourdon',
    label: 'Un Bourdon',
    description: 'Homme (cis ou trans)',
    icon: <User2 className="w-4 h-4" />
  },
  {
    id: 'jardin',
    label: 'Un Jardin',
    description: 'Non-binaire / Autre',
    icon: <Users className="w-4 h-4" />
  }
];

interface ProfileTypeSelectionProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  isSearching?: boolean;
}

export function ProfileTypeSelection({ 
  label, 
  value, 
  onChange,
  isSearching = false 
}: ProfileTypeSelectionProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profileTypes.map((type) => (
          <motion.button
            key={type.id}
            type="button"
            onClick={() => onChange?.(type.id)}
            className={`
              flex flex-col items-center p-4 border-2 rounded-lg text-sm
              ${value === type.id 
                ? 'border-pink-500 bg-pink-50' 
                : 'border-pink-200 hover:border-pink-500 hover:bg-pink-50'
              }
              transition-colors
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {type.icon}
              <span className="font-medium">
                {isSearching ? type.label.replace('Un', 'Des').replace('Une', 'Des') : type.label}
              </span>
            </div>
            <span className="text-xs text-gray-600">{type.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}