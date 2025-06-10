import { auth, db } from './firebase-admin';
import { doc, setDoc } from 'firebase/firestore';

export async function setupAdminAccount(email: string, password: string) {
  try {
    // 1. Créer l'utilisateur admin
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const adminId = userCredential.user.uid;

    // 2. Créer le document admin dans Firestore
    await setDoc(doc(db, 'admins', adminId), {
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    console.log('Compte admin créé avec succès');
    return adminId;
  } catch (error: any) {
    console.error('Erreur lors de la création du compte admin:', error);
    throw error;
  }
}