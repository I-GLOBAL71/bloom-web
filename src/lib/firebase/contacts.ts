import { 
  collection, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  getDoc,
  setDoc 
} from 'firebase/firestore';
import { db } from './config';
import type { ContactRequest } from '../../types';

const contactRequestsCollection = collection(db, 'contactRequests');

export async function sendContactRequest(requestData: Omit<ContactRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
  try {
    const newRequestRef = doc(contactRequestsCollection);
    await setDoc(newRequestRef, {
      ...requestData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newRequestRef.id;
  } catch (error) {
    console.error('Error sending contact request:', error);
    throw error;
  }
}

export async function acceptContactRequest(requestId: string) {
  try {
    const requestRef = doc(contactRequestsCollection, requestId);
    const requestDoc = await getDoc(requestRef);

    if (!requestDoc.exists()) {
      throw new Error('Contact request not found');
    }

    const request = requestDoc.data() as ContactRequest;
    if (request.status !== 'pending') {
      throw new Error('Contact request is no longer pending');
    }

    await updateDoc(requestRef, {
      status: 'accepted',
      updatedAt: serverTimestamp(),
    });

    // Ici, vous pourriez également créer une conversation entre les deux utilisateurs
    // ou mettre à jour d'autres collections si nécessaire

  } catch (error) {
    console.error('Error accepting contact request:', error);
    throw error;
  }
}

export async function rejectContactRequest(requestId: string) {
  try {
    const requestRef = doc(contactRequestsCollection, requestId);
    const requestDoc = await getDoc(requestRef);

    if (!requestDoc.exists()) {
      throw new Error('Contact request not found');
    }

    const request = requestDoc.data() as ContactRequest;
    if (request.status !== 'pending') {
      throw new Error('Contact request is no longer pending');
    }

    await updateDoc(requestRef, {
      status: 'rejected',
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    console.error('Error rejecting contact request:', error);
    throw error;
  }
}

export async function getContactRequest(requestId: string): Promise<ContactRequest | null> {
  try {
    const requestRef = doc(contactRequestsCollection, requestId);
    const requestDoc = await getDoc(requestRef);

    if (!requestDoc.exists()) {
      return null;
    }

    return {
      id: requestDoc.id,
      ...(requestDoc.data() as Omit<ContactRequest, 'id'>),
    };
  } catch (error) {
    console.error('Error getting contact request:', error);
    throw error;
  }
}