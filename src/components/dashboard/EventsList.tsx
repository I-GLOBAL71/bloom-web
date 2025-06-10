import React from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, MapPin, Users, Wallet, Share2, Plus, History, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GradientButton } from '../ui/GradientButton';
import { CreateEventModal } from '../events/CreateEventModal.new';
import { EventHistory } from '../events/EventHistory';
import { QRCodeGenerator } from '../events/QRCodeGenerator';
import type { Event, CreateEventData } from '../../types';
import { formatEventDate } from '../../utils/dateUtils';

interface EventsListProps {
  events: Event[];
  currentUserId: string;
  onShare: (eventId: string) => void;
  onJoin: (eventId: string) => void;
  onCreateEvent: (eventData: CreateEventData) => Promise<string>;
  onRateEvent: (eventId: string, rating: number) => Promise<void>;
  initialShowModal?: boolean;
}

export function EventsList({
  events,
  currentUserId,
  onShare,
  onJoin,
  onCreateEvent,
  onRateEvent,
  initialShowModal = false
}: EventsListProps) {
  const { t } = useTranslation('events');
  const [showCreateModal, setShowCreateModal] = React.useState(initialShowModal);
  const location = useLocation();

  React.useEffect(() => {
    setShowCreateModal(false);
  }, [location.pathname]);
  const [showQRCode, setShowQRCode] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'upcoming' | 'past' | 'mine'>('upcoming');
  const [showFilters, setShowFilters] = React.useState(false);

  const upcomingEvents = events.filter(event =>
    event.status === 'upcoming' || new Date(event.date) > new Date()
  );

  const myEvents = events.filter(event =>
    event.organizer?.id === currentUserId
  );

  const activeEvents = activeTab === 'upcoming'
    ? upcomingEvents
    : activeTab === 'mine'
    ? myEvents
    : events;

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Tabs and Create Button */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-center sm:justify-end">
          <GradientButton
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 justify-center py-3 px-6 text-base shadow-lg hover:shadow-xl transform transition hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>{t('events.actions.create')}</span>
          </GradientButton>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-pink-500 text-white'
                : 'text-gray-600 hover:text-pink-500'
            } flex-1 sm:flex-none justify-center sm:justify-start`}
          >
            <Calendar className="w-5 h-5" />
            <span>{t('events.tabs.upcoming')}</span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'past'
                ? 'bg-pink-500 text-white'
                : 'text-gray-600 hover:text-pink-500'
            } flex-1 sm:flex-none justify-center sm:justify-start`}
          >
            <History className="w-5 h-5" />
            <span>{t('events.tabs.past')}</span>
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mine'
                ? 'bg-pink-500 text-white'
                : 'text-gray-600 hover:text-pink-500'
            } flex-1 sm:flex-none justify-center sm:justify-start`}
          >
            <Users className="w-5 h-5" />
            <span>{t('events.tabs.myEvents')}</span>
          </button>
        </div>
      </div>

      {/* Event List or History */}
      {activeTab === 'past' ? (
        <EventHistory events={events} onRate={onRateEvent} />
      ) : activeEvents.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-xl shadow-sm border border-pink-100">
          <div className="mb-4">
            <Calendar className="w-12 h-12 mx-auto text-pink-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === 'mine'
              ? t('events.empty.noMyEvents')
              : t('events.empty.noEvents')}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'mine'
              ? t('events.empty.createPrompt')
              : t('events.empty.joinPrompt')}
          </p>
          <GradientButton
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 py-2.5 px-5 shadow-lg hover:shadow-xl transform transition hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>{t('events.empty.createFirst')}</span>
          </GradientButton>
        </div>
      ) : (
        activeEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 hover:shadow-xl transition-shadow">
            <div className="aspect-[3/1] relative">
              <img
                src={event.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-2">
                <h3 className="text-xl font-semibold text-white mb-1">{event.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatEventDate(event.date)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4 sm:p-6">
              <p className="text-gray-600">{event.description}</p>
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {event.location.address}, {event.location.city}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {event.participants?.length ?? 0}
                    {event.maxParticipants && ` / ${event.maxParticipants}`} {t('events.details.participants')}
                  </span>
                </div>
                
                {event.entryFee && (
                  <div className="flex flex-wrap items-center gap-2 text-gray-600">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">{event.entryFee} {t('dashboard.petals.cost', { count: event.entryFee })}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <GradientButton onClick={() => onJoin(event.id)} fullWidth>
                  {t('events.actions.join')}
                </GradientButton>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <button
                    onClick={() => setShowQRCode(event.id)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-pink-100 hover:bg-pink-50 transition-colors"
                  >
                    <QrCode className="w-5 h-5 text-pink-500 inline-block mr-2" />
                    <span className="sm:hidden">{t('events.actions.qrCode')}</span>
                  </button>
                  <button
                    onClick={() => onShare(event.id)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-pink-100 hover:bg-pink-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-pink-500 inline-block mr-2" />
                    <span className="sm:hidden">{t('events.actions.share')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onCreateEvent}
      />

      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('events.details.qrCodeTitle')}</h3>
            <QRCodeGenerator eventId={showQRCode} />
            <button
              onClick={() => setShowQRCode(null)}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
            >
              {t('events.actions.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}