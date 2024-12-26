import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Rewind, Star, Clock } from 'lucide-react';
import { useSpendPetals, SPENDING_ACTIONS } from './hooks/useSpendPetals';
import { SpendingConfirmation } from './SpendingConfirmation';

const ACTION_ICONS = {
  'super-like': Star,
  'boost': Zap,
  'rewind': Rewind,
  'extend-chat': Clock
};

export function SpendingOptions() {
  const { canAfford, spendPetalsForAction } = useSpendPetals();
  const [selectedAction, setSelectedAction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (selectedAction) {
      const success = await spendPetalsForAction(selectedAction);
      if (success) {
        // Ici, vous pouvez déclencher l'effet de l'action
        // Par exemple, activer le boost, envoyer le super like, etc.
      }
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(SPENDING_ACTIONS).map((action) => {
          const Icon = ACTION_ICONS[action.id];
          const affordable = canAfford(action.cost);

          return (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`
                p-4 rounded-xl border-2 text-left
                ${affordable
                  ? 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
                }
              `}
              whileHover={affordable ? { scale: 1.02 } : undefined}
              whileTap={affordable ? { scale: 0.98 } : undefined}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-3
                ${affordable ? 'bg-pink-100' : 'bg-gray-100'}
              `}>
                <Icon className={`w-5 h-5 ${affordable ? 'text-pink-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{action.name}</h3>
                <p className="text-sm text-gray-500">{action.cost} pétales</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedAction && (
        <SpendingConfirmation
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirm}
          action={selectedAction}
          canAfford={canAfford(selectedAction.cost)}
        />
      )}
    </>
  );
}