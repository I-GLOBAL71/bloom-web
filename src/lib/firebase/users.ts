import { collection, getDocs, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './config';
import type { User } from '../../types';

// Fonction pour récupérer la liste des utilisateurs
export const getUsers = async (): Promise<User[]> => {
  const usersCollection = collection(db, 'users');
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email || '',
      displayName: data.displayName || data.name || '',
      name: data.name,
      photoURL: data.photoURL,
      phoneNumber: data.phone,
      interests: data.interests || [],
      location: data.location || undefined,
      photos: data.photos || [],
      flowers: data.flowers || 0,
      hasCompletedOnboarding: data.hasCompletedOnboarding || false,
      isPremium: data.isPremium || false,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      lastActive: data.lastActive?.toDate(),
      gender: data.gender
    };
  });
};

// Fonction pour vérifier le solde d'un utilisateur
export const checkUserBalance = async (userId: string): Promise<number> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('Utilisateur non trouvé');
  }

  const userData = userDoc.data();
  return userData.flowers || 0;
};

// Fonction pour mettre à jour le solde d'un utilisateur
export const updateUserBalance = async (userId: string, amount: number): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  try {
    await updateDoc(userRef, {
      flowers: increment(amount)
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du solde:', error);
    throw new Error('Échec de la mise à jour du solde');
  }
};

// Fonction pour obtenir les détails d'un utilisateur
export const getUserDetails = async (userId: string): Promise<User> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('Utilisateur non trouvé');
  }

  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data.email || '',
    displayName: data.displayName || data.name || '',
    name: data.name,
    photoURL: data.photoURL,
    phoneNumber: data.phone,
    interests: data.interests || [],
    location: data.location || undefined,
    photos: data.photos || [],
    flowers: data.flowers || 0,
    hasCompletedOnboarding: data.hasCompletedOnboarding || false,
    isPremium: data.isPremium || false,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    lastActive: data.lastActive?.toDate(),
    gender: data.gender
  };
};

// Fonction pour enregistrer une transaction de paiement
interface PaymentTransaction {
  eventId: string;
  userId: string;
  amount: number;
  paymentId: string;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: number;
}

export const savePaymentTransaction = async (transaction: Omit<PaymentTransaction, 'timestamp'>) => {
  const transactionsRef = collection(db, 'payment_transactions');
  const newTransaction = {
    ...transaction,
    timestamp: Date.now(),
    status: 'pending'
  };
  
  try {
    await updateDoc(doc(transactionsRef), newTransaction);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la transaction:', error);
    throw new Error('Échec de l\'enregistrement de la transaction');
  }
};
