import { create } from 'zustand';

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  petals: number;
  price: number;
  features: string[];
  popular?: boolean;
}

interface CreditState {
  balance: number;
  packages: CreditPackage[];
  transactions: Transaction[];
  subscription: Subscription | null;
}

interface Transaction {
  id: string;
  type: 'purchase' | 'reward' | 'spent';
  amount: number;
  description: string;
  timestamp: number;
}

interface Subscription {
  type: 'bud' | 'emerging' | 'passion' | 'garden';
  startDate: number;
  endDate: number;
  autoRenew: boolean;
}

interface CreditActions {
  addPetals: (amount: number, reason: string) => void;
  spendPetals: (amount: number, reason: string) => void;
  setSubscription: (subscription: Subscription | null) => void;
}

export const useCreditStore = create<CreditState & CreditActions>((set) => ({
  balance: 0,
  packages: [
    {
      id: 'bud',
      name: 'Bouton',
      description: 'Parfait pour commencer',
      petals: 100,
      price: 0,
      features: [
        'Likes limités',
        'Messages basiques',
        'Publicités',
      ]
    },
    {
      id: 'emerging',
      name: 'Fleur Naissante',
      description: 'Pour plus de possibilités',
      petals: 500,
      price: 9.99,
      features: [
        'Likes illimités',
        'Messages avancés',
        'Sans publicité',
      ]
    },
    {
      id: 'passion',
      name: 'Bouquet Passion',
      description: 'L\'expérience optimale',
      petals: 1200,
      price: 19.99,
      features: [
        'Super Likes illimités',
        'Boost hebdomadaire',
        'Messages prioritaires',
      ],
      popular: true
    },
    {
      id: 'garden',
      name: 'Jardin d\'Amour',
      description: 'Pour les plus exigeants',
      petals: 3000,
      price: 39.99,
      features: [
        'Tout débloqué',
        'Boost quotidien',
        'Support VIP',
      ]
    }
  ],
  transactions: [],
  subscription: null,

  addPetals: (amount, reason) => set((state) => ({
    balance: state.balance + amount,
    transactions: [
      {
        id: Date.now().toString(),
        type: 'purchase',
        amount,
        description: reason,
        timestamp: Date.now()
      },
      ...state.transactions
    ]
  })),

  spendPetals: (amount, reason) => set((state) => ({
    balance: Math.max(0, state.balance - amount),
    transactions: [
      {
        id: Date.now().toString(),
        type: 'spent',
        amount: -amount,
        description: reason,
        timestamp: Date.now()
      },
      ...state.transactions
    ]
  })),

  setSubscription: (subscription) => set({ subscription })
}));