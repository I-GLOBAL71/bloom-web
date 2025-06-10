import React, { createContext, useContext, useState } from 'react';

interface PetalCosts {
  contactRequest: number;
  sendMessage: number;
}

interface PetalCostsContextType {
  costs: PetalCosts;
  updateCosts: (newCosts: PetalCosts) => void;
}

const defaultCosts: PetalCosts = {
  contactRequest: 5,
  sendMessage: 2
};

const PetalCostsContext = createContext<PetalCostsContextType | undefined>(undefined);

export function PetalCostsProvider({ children }: { children: React.ReactNode }) {
  const [costs, setCosts] = useState<PetalCosts>(defaultCosts);

  const updateCosts = (newCosts: PetalCosts) => {
    setCosts(newCosts);
    // TODO: Sync with backend
  };

  return (
    <PetalCostsContext.Provider value={{ costs, updateCosts }}>
      {children}
    </PetalCostsContext.Provider>
  );
}

export function usePetalCosts() {
  const context = useContext(PetalCostsContext);
  if (context === undefined) {
    throw new Error('usePetalCosts must be used within a PetalCostsProvider');
  }
  return context;
}