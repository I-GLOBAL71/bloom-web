import { doc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from './config';

export async function checkUserBalance(userId: string): Promise<number> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('Utilisateur non trouvé');
    }
    return userDoc.data()?.flowers || 0;
  } catch (error) {
    console.error('Erreur lors de la vérification du solde:', error);
    throw error;
  }
}

export async function processEventContribution(
  userId: string,
  eventId: string,
  amount: number
): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }

      const currentBalance = userDoc.data()?.flowers || 0;
      
      if (currentBalance < amount) {
        throw new Error('Solde de fleurs insuffisant');
      }

      // Mise à jour du solde de l'utilisateur
      transaction.update(doc(db, 'users', userId), {
        flowers: currentBalance - amount
      });

      // Ajout de la contribution à l'événement
      transaction.update(doc(db, 'events', eventId), {
        contributions: [{
          userId,
          amount,
          timestamp: new Date(),
          isOrganizer: true
        }]
      });
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la contribution:', error);
    throw error;
  }
}