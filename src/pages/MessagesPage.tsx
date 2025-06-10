import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChatContainer } from '../components/chat/ChatContainer';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { MessageCircle, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

interface MessagesPageProps {
  view?: 'list' | 'chat';
}

interface RecentConversation {
  userId: string;
  user: User;
  lastMessage: string;
  lastMessageTime: Date;
}

export function MessagesPage({ view = 'list' }: MessagesPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const recipient = location.state?.recipient as User | undefined;
  const { user: currentUser } = useAuth();
  const [recentConversations, setRecentConversations] = React.useState<RecentConversation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  useEffect(() => {
    if (view === 'chat' && userId && !recipient) {
      navigate('/app/messages');
    }
  }, [userId, recipient, navigate, view]);

  useEffect(() => {
    const fetchRecentConversations = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        setError(null);

        const conversationsRef = collection(db, 'conversationHistory');
        const q = query(
          conversationsRef,
          where('participants', 'array-contains', currentUser.id),
          orderBy('lastMessageTime', 'desc')
        );

        const snapshot = await getDocs(q);
        const conversations: RecentConversation[] = [];

        for (const doc of snapshot.docs) {
          const data = doc.data();
          const otherUserId = data.participants.find((id: string) => id !== currentUser.id);
          
          if (otherUserId) {
            conversations.push({
              userId: otherUserId,
              user: {
                id: otherUserId,
                displayName: data.recipientDisplayName || `User ${otherUserId}`,
                photoURL: data.recipientPhotoURL || null,
                email: '',
                phoneNumber: null,
                hasCompletedOnboarding: true,
                isVerified: false
              } as User,
              lastMessage: data.lastMessage || '',
              lastMessageTime: data.lastMessageTime?.toDate() || new Date()
            });
          }
        }

        setRecentConversations(conversations);
      } catch (err) {
        console.error('Error fetching recent conversations:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch conversations'));
      } finally {
        setLoading(false);
      }
    };

    fetchRecentConversations();
  }, [currentUser]);

  const handleBackToList = () => {
    navigate('/app/messages');
  };

  const handleSelectUser = (user: User) => {
    navigate(`/app/messages/chat/${user.id}`, { state: { recipient: user } });
  };

  const renderConversationsList = () => {
      if (loading) {
        return (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          </div>
        );
      }
  
      if (error) {
        return (
          <div className="p-4 text-center text-rose-500">
            Une erreur est survenue lors du chargement des conversations
          </div>
        );
      }
  
      if (!recentConversations.length) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
            <p>Aucune conversation récente</p>
          </div>
        );
      }
  
      const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
          return new Intl.DateTimeFormat('fr', { hour: '2-digit', minute: '2-digit' }).format(date);
        } else if (days === 1) {
          return 'Hier';
        } else if (days < 7) {
          return new Intl.DateTimeFormat('fr', { weekday: 'long' }).format(date);
        } else {
          return new Intl.DateTimeFormat('fr', { day: '2-digit', month: 'short' }).format(date);
        }
      };
  
      return (
        <div className="divide-y divide-rose-100">
          {recentConversations.map((conversation) => (
            <button
              key={conversation.userId}
              onClick={() => handleSelectUser(conversation.user)}
              className="w-full p-4 flex items-center gap-4 hover:bg-rose-50 transition-colors text-left"
            >
              <div className="relative flex-shrink-0">
                {conversation.user.photoURL ? (
                  <img
                    src={conversation.user.photoURL}
                    alt={conversation.user.displayName || ''}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-xl font-semibold text-rose-600">
                      {(conversation.user.displayName || '')?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.user.displayName}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(conversation.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage || 'Nouvelle conversation'}
                </p>
              </div>
            </button>
          ))}
        </div>
      );
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white">
      {view === 'chat' && recipient ? (
        <ChatContainer
          recipient={recipient}
          onBack={handleBackToList}
        />
      ) : (
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
            <div className="p-4 border-b border-rose-100 bg-white sticky top-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Messages
              </h1>
            </div>
            {renderConversationsList()}
          </div>
        </div>
      )}
    </div>
  );
}