import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Wallet, Scan, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GradientCard } from '../ui/GradientCard';
import { EventPaymentModal } from './EventPaymentModal';
import { QRCodeScanner } from './QRCodeScanner';
import type { EventWithAuth } from '../../lib/firebase/events';

interface EventCardProps {
  event: EventWithAuth;
  onJoin?: (eventId: string) => Promise<void>;
  isParticipant?: boolean;
}

export function EventCard({ event, onJoin, isParticipant }: EventCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const isFullyBooked = event.currentParticipants >= event.maxParticipants;
  const isOrganizer = user?.id === event.creator.id;
  const hasPaid = isParticipant && event.price > 0;

  const handleParticipateClick = () => {
    if (!onJoin) return;
    
    if (event.price > 0) {
      setShowPaymentModal(true);
    } else {
      onJoin(event.id);
    }
  };

  const handlePaymentComplete = () => {
    if (!onJoin) return;
    setShowPaymentModal(false);
    onJoin(event.id);
  };

  const handleScanComplete = () => {
    setShowQRScanner(false);
  };

  const handleMessageOrganizer = () => {
    navigate(`/messages/${event.creator.id}`, {
      state: { 
        eventTitle: event.title,
        organizerName: event.creator.name || event.creator.displayName || 'Utilisateur'
      }
    });
  };

  return (
    <>
      <GradientCard className="w-full max-w-md overflow-hidden group transition-transform duration-200 hover:-translate-y-1">
        <div className="relative aspect-video">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-800">
              {isFullyBooked ? 'Complet' : `${event.currentParticipants}/${event.maxParticipants} places`}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              event.price > 0 ? 'bg-amber-400 text-amber-900' : 'bg-green-400 text-green-900'
            }`}>
              {event.price > 0 ? 'Payant' : 'Gratuit'}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-200 transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(event.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="text-white/60">•</span>
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {new Date(event.date).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-gray-600 line-clamp-2">{event.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {event.location.address},{' '}
                {event.location.city}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {event.currentParticipants} / {event.maxParticipants} participants
              </span>
            </div>
            {event.price > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Wallet className="w-4 h-4" />
                <span className="text-sm">{event.price} fleurs</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isOrganizer && (
              <button
                onClick={handleMessageOrganizer}
                className="flex-none px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            )}

            {isOrganizer && event.price > 0 && (
              <button
                onClick={() => setShowQRScanner(true)}
                className="flex-none px-4 py-2 rounded-lg font-medium bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
              >
                <Scan className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={handleParticipateClick}
              disabled={isFullyBooked || isParticipant}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                ${
                  isFullyBooked || isParticipant
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                }`}
            >
              {isParticipant ? 'Déjà inscrit' : isFullyBooked ? 'Complet' : 'Participer'}
            </button>
          </div>
        </div>
      </GradientCard>

      {showPaymentModal && user && (
        <EventPaymentModal
          event={event}
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {showQRScanner && (
        <QRCodeScanner
          eventId={event.id}
          onClose={() => setShowQRScanner(false)}
          onScanComplete={handleScanComplete}
        />
      )}
    </>
  );
}