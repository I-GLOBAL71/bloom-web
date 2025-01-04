import * as React from 'react';
import { CreditSection } from '../../credits';

export function CreditsSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des pétales</h1>
      <CreditSection />
    </div>
  );
}
