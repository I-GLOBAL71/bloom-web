import { useState } from 'react';
import { useCreditStore, CreditPackage } from '../store/creditStore';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const { addPetals, setSubscription } = useCreditStore();

  const handlePayment = async (pkg: CreditPackage) => {
    setLoading(true);
    try {
      // Ici, nous simulons l'intégration avec Stripe
      // En production, il faudrait intégrer réellement Stripe
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ajouter les pétales
      addPetals(pkg.petals, `Achat du pack ${pkg.name}`);

      // Si c'est un abonnement, le configurer
      if (pkg.price > 0) {
        setSubscription({
          type: pkg.id as any,
          startDate: Date.now(),
          endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 jours
          autoRenew: true
        });
      }

      return true;
    } catch (error) {
      console.error('Payment error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handlePayment
  };
}