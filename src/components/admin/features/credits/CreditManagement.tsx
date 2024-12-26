import React from 'react';
import { motion } from 'framer-motion';
import { CreditStats } from './CreditStats';
import { CreditPackages } from './CreditPackages';
import { TransactionHistory } from './TransactionHistory';

export function CreditManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Crédits</h1>
      
      <CreditStats />
      <CreditPackages />
      <TransactionHistory />
    </div>
  );
}