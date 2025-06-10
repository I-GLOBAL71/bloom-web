import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from './config';
import type { Notification } from '../../types';

const NOTIFICATIONS_COLLECTION = 'notifications';

// Export de la collection pour les souscriptions en temps réel
export const notificationsCollection = collection(db, NOTIFICATIONS_COLLECTION);

export async function createNotification(
  userId: string,
  type: Notification['type'],
  data: Notification['data']
) {
  try {
    const notificationData: Omit<Notification, 'id'> = {
      type,
      data,
      userId,
      read: false,
      createdAt: Timestamp.now() as unknown as Date
    };

    const docRef = await addDoc(notificationsCollection, notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const q = query(
      notificationsCollection,
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Notification[];
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    throw error;
  }
}

// Fonctions utilitaires pour créer des notifications spécifiques
export const createContactRequestNotification = (userId: string, senderName: string, senderId: string) =>
  createNotification(userId, 'contact_request', { senderName, senderId });

export const createEventJoinNotification = (userId: string, eventId: string, eventTitle: string) =>
  createNotification(userId, 'event_join', {
    eventId,
    eventTitle,
    userId: userId, // Add required fields
    userName: 'User' // Add required fields
  });

export const createMatchNotification = (userId: string, matchId: string, matchName: string) =>
  createNotification(userId, 'match', { matchId, matchName });

export const createProfileLikeNotification = (userId: string, senderId: string, senderName: string) =>
  createNotification(userId, 'profile_like', { senderId, senderName });

export const createUnreadMessageNotification = (
  userId: string,
  senderId: string,
  senderName: string,
  senderPhotoURL: string | undefined,
  messagePreview: string
) =>
  createNotification(userId, 'unread_message', {
    senderId,
    senderName,
    senderPhotoURL,
    messagePreview
  });