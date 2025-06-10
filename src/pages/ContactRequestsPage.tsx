import React, { useState } from 'react';
import { Check, X, Clock, UserPlus, HeartHandshake, PartyPopper, Sparkles, UserCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useContactRequests } from '../hooks/useContactRequests';
import { acceptContactRequest, rejectContactRequest } from '../lib/firebase/contacts';
import { formatRelativeTime } from '../utils/dateUtils';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import type { ContactRequest } from '../types';

export function ContactRequestsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sentRequests, receivedRequests, loading, error } = useContactRequests();
  const [selectedRequest, setSelectedRequest] = useState<string>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const navigateToTab = (tab: 'discover' | 'events' | 'messages' | 'profile') => {
    switch (tab) {
      case 'discover':
        navigate('/app/dashboard');
        break;
      case 'events':
        navigate('/app/events');
        break;
      case 'messages':
        navigate('/app/messages');
        break;
      case 'profile':
        navigate('/app/profile');
        break;
    }
  };

  const renderBottomTab = (tab: 'discover' | 'events' | 'messages' | 'profile', icon: React.ReactNode, label: string) => (
    <button
      onClick={() => navigateToTab(tab)}
      className={`
        flex flex-col items-center px-3 py-1.5 transition-all duration-300 ease-in-out
        relative overflow-hidden rounded-lg text-gray-500 hover:text-rose-400 hover:scale-105
      `}
    >
      <div className="transform transition-all duration-300 mb-0.5 scale-100 hover:scale-105">
        {icon}
      </div>
      <span className="text-xs font-medium tracking-wide transition-opacity duration-300 opacity-70">
        {label}
      </span>
    </button>
  );

  const handleAccept = async (request: ContactRequest) => {
    if (!user?.phoneNumber) {
      toast.error('Vous devez ajouter votre numéro de téléphone pour accepter des demandes de contact');
      return;
    }

    try {
      await acceptContactRequest(request.id, user.phoneNumber);
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

  const handleReject = async (request: ContactRequest) => {
    try {
      await rejectContactRequest(request.id);
      
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center text-rose-500 mb-2">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-pink-500 hover:text-pink-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const noRequests = receivedRequests.length === 0 && sentRequests.length === 0;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Demandes de contact</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'received'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reçues ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'sent'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Envoyées ({sentRequests.length})
          </button>
        </div>

        {noRequests ? (
          <div className="text-center p-8 text-gray-500 bg-white rounded-lg shadow">
            <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune demande de contact</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
            {activeTab === 'received' ? (
              receivedRequests.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune demande de contact reçue</p>
                </div>
              ) : (
                receivedRequests.map((request) => (
                  <div key={request.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                          {request.senderPhotoURL ? (
                            <img
                              src={request.senderPhotoURL}
                              alt={request.senderName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserPlus className="w-5 h-5 text-pink-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {request.senderName} souhaite se connecter avec vous
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatRelativeTime(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      {selectedRequest === request.id ? (
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
                              onClick={() => handleAccept(request)}
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
                            onClick={() => handleReject(request)}
                            className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                            title="Refuser"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSelectedRequest(request.id)}
                            className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                            title="Accepter"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              // Sent requests
              sentRequests.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune demande de contact envoyée</p>
                </div>
              ) : (
                sentRequests.map((request) => (
                  <div key={request.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {request.receiverPhotoURL ? (
                          <img
                            src={request.receiverPhotoURL}
                            alt={request.receiverName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserPlus className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          Demande envoyée à {request.receiverName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatRelativeTime(request.createdAt)}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          En attente de réponse
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}
        </div>
      </div>
      
      <nav className="fixed bottom-0 w-full px-4 py-2 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg transform transition-transform duration-300 ease-in-out mx-auto rounded-t-2xl">
        <div className="container mx-auto px-2">
          <div className="flex justify-around items-center max-w-md mx-auto relative">
            {renderBottomTab('discover', <HeartHandshake className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.discover'))}
            {renderBottomTab('events', <PartyPopper className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.events'))}
            {renderBottomTab('messages', <Sparkles className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.messages'))}
            {renderBottomTab('profile', <UserCircle2 className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.profile'))}
          </div>
        </div>
      </nav>
    </div>
  );
}