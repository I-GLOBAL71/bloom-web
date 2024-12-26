import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

interface SpendingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: {
    name: string;
    cost: number;
    description: string;
  };
  canAfford: boolean;
}

export function SpendingConfirmation({
  isOpen,
  onClose,
  onConfirm,
  action,
  canAfford
}: SpendingConfirmationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Confirmation d'achat</h3>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">{action.description}</p>
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                <span className="font-medium">{action.name}</span>
                <span className="font-bold text-pink-600">{action.cost} pétales</span>
              </div>
            </div>

            {!canAfford && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p>Solde insuffisant pour cette action</p>
              </div>
            )}

            <div className="flex gap-4">
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Annuler
              </motion.button>
              <motion.button
                onClick={onConfirm}
                disabled={!canAfford}
                className={`
                  flex-1 py-3 rounded-xl font-medium
                  ${canAfford
                    ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
                whileHover={canAfford ? { scale: 1.02 } : undefined}
                whileTap={canAfford ? { scale: 0.98 } : undefined}
              >
                Confirmer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}