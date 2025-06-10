import React from 'react';
import { Bell, UserPlus, Heart, Check, X, Calendar, MessageCircle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { Notification } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { acceptContactRequest, rejectContactRequest } from '../../lib/firebase/contacts';

interface NotificationsListProps {
  onClose?: () => void;
}

function NotificationsList({ onClose }: NotificationsListProps) {
  const { notifications, loading, error: notifError, markAsRead } = useNotifications();
  const [selectedRequest, setSelectedRequest] = React.useState<string>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAccept = async (notification: Notification) => {
    if (!notification.data?.requestId) return;
    
    try {
      if (!user?.phoneNumber) {
        toast.error('Vous devez ajouter votre numéro de téléphone pour accepter des demandes de contact');
        return;
      }

      await acceptContactRequest(notification.data.requestId, user.phoneNumber);
      await markAsRead(notification.id);
      setSelectedRequest(undefined);
      
      toast.success('Demande de contact acceptée !', {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (err) {
      console.error('Error accepting request:', err);
      toast.error('Erreur lors de l\'acceptation de la demande');
    }
  };

  const handleReject = async (notification: Notification) => {
    if (!notification.data?.requestId) return;
    
    try {
      await rejectContactRequest(notification.data.requestId);
      await markAsRead(notification.id);
      
      toast.success('Demande de contact refusée', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error('Erreur lors du refus de la demande');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    
    // Fermer le menu des notifications
    onClose?.();

    // Naviguer vers la page appropriée
    switch (notification.type) {
      case 'event_join':
        navigate(`/events/${notification.data.eventId}`);
        break;
      case 'match':
        navigate(`/profile/${notification.data.matchId}`);
        break;
      case 'unread_message':
        navigate(`/messages/${notification.data.senderId}`);
        break;
      case 'profile_like':
        navigate(`/profile/${notification.data.senderId}`);
        break;
    }
  };

  const renderNotificationIcon = (type: Notification['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'contact_request':
        return <UserPlus className={`${iconClass} text-pink-500`} />;
      case 'event_join':
        return <Calendar className={`${iconClass} text-indigo-500`} />;
      case 'match':
        return <Heart className={`${iconClass} text-rose-500`} fill="currentColor" />;
      case 'profile_like':
        return <Heart className={`${iconClass} text-pink-500`} />;
      case 'unread_message':
        return <MessageCircle className={`${iconClass} text-blue-500`} />;
    }
  };

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'contact_request':
        return `${notification.data.senderName} souhaite se connecter avec vous`;
      case 'event_join':
        return `Nouveau participant à votre événement : ${notification.data.eventTitle}`;
      case 'match':
        return `Nouveau match avec ${notification.data.matchName} !`;
      case 'profile_like':
        return `${notification.data.senderName} a aimé votre profil`;
      case 'unread_message':
        return notification.data.messagePreview || `Nouveau message de ${notification.data.senderName}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (notifError) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-center text-rose-500 mb-2">
          Une erreur est survenue lors du chargement des notifications
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-pink-500 hover:text-pink-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-pink-100">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 ${notification.read ? 'bg-white' : 'bg-pink-50'}`}
        >
          {notification.type === 'contact_request' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  {renderNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {renderNotificationContent(notification)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </div>

              {selectedRequest === notification.id ? (
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-gray-900 mb-4">
                    Partager votre numéro : <span className="font-medium">{user?.phoneNumber || 'Non renseigné'}</span>
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedRequest(undefined)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleAccept(notification)}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg"
                      disabled={!user?.phoneNumber}
                    >
                      Confirmer & Partager
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleReject(notification)}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                    title="Refuser"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedRequest(notification.id)}
                    className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                    title="Accepter"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="flex items-start gap-4 cursor-pointer hover:bg-pink-50 transition-colors"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                {renderNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {renderNotificationContent(notification)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default NotificationsList;