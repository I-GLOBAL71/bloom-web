import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CreditBalance } from './CreditBalance';
import { CreditPackages } from './CreditPackages';
import { TransactionHistory } from './TransactionHistory';
import { SpendingOptions } from './SpendingOptions';

interface CreditSectionProps {
  onClose: () => void;
}

export function CreditSection({ onClose }: CreditSectionProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vos Pétales</h2>
        <motion.button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <CreditBalance />
        <SpendingOptions />
        <CreditPackages />
        <TransactionHistory />
      </div>
    </div>
  );
}