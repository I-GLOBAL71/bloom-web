import { useState, useEffect } from 'react';
import { onSnapshot, query, where, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { notificationsCollection, markNotificationAsRead } from '../lib/firebase/notifications';
import { auth } from '../lib/firebase/config';
import type { Notification } from '../types';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!user?.id) {
      console.warn('useNotifications: Pas d\'utilisateur authentifié');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('useNotifications: Pas d\'utilisateur Firebase authentifié');
      console.log('useNotifications: État de l\'authentification:', {
        currentUser: 'null',
        authStateUser: user,
        isAuthLoading: loading
      });
      setError("Vous devez être connecté pour voir vos notifications. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    if (currentUser.uid !== user.id) {
      console.warn('useNotifications: Conflit d\'identifiants', {
        firebaseUid: currentUser.uid,
        contextUserId: user.id
      });
      setError("Erreur d'identification. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    console.log('useNotifications: Configuration pour l\'utilisateur', {
      userId: user.id,
      firebaseUid: currentUser.uid,
      isAuthenticated: !!currentUser
    });
    let unsubscribe: () => void;

    const setupNotificationsListener = async () => {
      try {
        console.log('useNotifications: Création de la requête pour userId:', user.id);
        
        // Vérifier l'authentification Firebase actuelle
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('Utilisateur Firebase non authentifié');
        }
        console.log('useNotifications: Utilisateur Firebase authentifié:', currentUser.uid);

        // Requête avec limite explicite
        const notificationsQuery = query(
          notificationsCollection,
          where('userId', '==', user.id),
          limit(100) // Ajout d'une limite explicite
        );

        console.log('useNotifications: Configuration du listener...');
        
        // Souscrire aux mises à jour en temps réel
        unsubscribe = onSnapshot(
          notificationsQuery,
          (snapshot) => {
            console.log('useNotifications: Données reçues, nombre de docs:', snapshot.docs.length);
            const newNotifications = snapshot.docs
              .map(doc => {
                const data = doc.data();
                console.log('useNotifications: Document data:', data);
                // Ensure the notification data matches the type
                const baseNotification = {
                  id: doc.id,
                  type: data.type,
                  userId: data.userId,
                  read: data.read,
                  createdAt: data.createdAt.toDate(),
                  data: data.data
                } as Notification;

                return baseNotification;
              })
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            setNotifications(newNotifications);
            setLoading(false);
            setError(undefined);
          },
          (err) => {
            console.error('useNotifications: Erreur détaillée:', {
              code: err.code,
              message: err.message,
              stack: err.stack
            });
            setError("Une erreur est survenue lors du chargement des notifications.");
            setNotifications([]);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Erreur lors de la configuration des notifications:', err);
        setError((err as Error).message);
        setLoading(false);
      }
    };

    setupNotificationsListener();

    // Nettoyer la souscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
      throw err;
    }
  };

  // Filtres par type de notification
  const getUnreadByType = (type: Notification['type']) =>
    notifications.filter(n => n.type === type && !n.read);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    // Nombre total de notifications non lues
    unreadCount: notifications.filter(n => !n.read).length,
    // Compteurs spécifiques par type
    unreadContacts: getUnreadByType('contact_request').length,
    unreadEvents: getUnreadByType('event_join').length,
    unreadMatches: getUnreadByType('match').length,
    unreadLikes: getUnreadByType('profile_like').length,
    unreadMessages: getUnreadByType('unread_message').length,
    // Liste filtrée par type
    contactRequests: notifications.filter(n => n.type === 'contact_request'),
    eventNotifications: notifications.filter(n => n.type === 'event_join'),
    matchNotifications: notifications.filter(n => n.type === 'match'),
    likeNotifications: notifications.filter(n => n.type === 'profile_like'),
    messageNotifications: notifications.filter(n => n.type === 'unread_message'),
  };
}