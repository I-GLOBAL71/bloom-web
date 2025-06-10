import { useCreditStore } from '../store/creditStore';

interface SpendingAction {
  id: string;
  name: string;
  cost: number;
  description: string;
}

export const SPENDING_ACTIONS: SpendingAction[] = {
  SUPER_LIKE: {
    id: 'super-like',
    name: 'Super Like',
    cost: 5,
    description: 'Envoyez un Super Like pour vous démarquer'
  },
  BOOST: {
    id: 'boost',
    name: 'Boost',
    cost: 20,
    description: 'Boostez votre profil pendant 30 minutes'
  },
  REWIND: {
    id: 'rewind',
    name: 'Rewind',
    cost: 3,
    description: 'Revenez sur votre dernier swipe'
  },
  EXTEND_CHAT: {
    id: 'extend-chat',
    name: 'Extension de chat',
    cost: 10,
    description: 'Prolongez une conversation temporaire'
  }
};

export function useSpendPetals() {
  const { balance, spendPetals } = useCreditStore();

  const canAfford = (cost: number) => balance >= cost;

  const spendPetalsForAction = async (action: SpendingAction) => {
    if (!canAfford(action.cost)) {
      throw new Error('Solde insuffisant');
    }

    try {
      spendPetals(action.cost, `Utilisation de ${action.name}`);
      return true;
    } catch (error) {
      console.error('Error spending petals:', error);
      return false;
    }
  };

  return {
    canAfford,
    spendPetalsForAction,
    SPENDING_ACTIONS
  };
}