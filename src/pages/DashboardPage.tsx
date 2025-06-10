import React, { useState, useEffect } from 'react';
import { HeartHandshake, PartyPopper, Sparkles, UserCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EventsList } from '../components/dashboard/EventsList';
import { ConversationGarden } from '../components/chat/ConversationGarden';
import { ChatContainer } from '../components/chat/ChatContainer';
import { SwipeContainer } from '../components/swipe/SwipeContainer';
import { UserProfile } from '../components/profile/UserProfile';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useLocation, useNavigate } from 'react-router-dom';
import type { CreateEventData, User, Event as AppEvent, EventParticipant } from '../types';
import type { EventWithAuth, NewEventWithAuth } from '../lib/firebase/events';
import { BuyPetalsModal } from '../components/payment/BuyPetalsModal';
import { FlowersModal } from '../components/payment/FlowersModal';

// Utility function to convert EventWithAuth[] to AppEvent[]
const convertEventsWithAuth = (events: EventWithAuth[]): AppEvent[] => {
  return events.map(event => ({
    ...event,
    organizerId: event.creator.id,
    organizerName: event.creator.displayName || 'Unknown',
    participants: (event.participants || []).map(userId => ({
      id: userId,
      displayName: 'Unknown',
      email: '',
      photoURL: '',
      hasCompletedOnboarding: false
    } as EventParticipant))
  })) as AppEvent[];
};

export function DashboardPage() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const { events: eventsWithAuth, loading, error, createEvent, rateEvent } = useEvents();
  const events = React.useMemo(() => convertEventsWithAuth(eventsWithAuth), [eventsWithAuth]);
  const location = useLocation();
  const navigate = useNavigate();

  // Convert authenticated user to User type
  const user: User | null = authUser ? {
    id: authUser.id,
    email: authUser.email || '',
    displayName: authUser.displayName || authUser.name || 'N/A',
    photoURL: authUser.photoURL || '',
    phoneNumber: authUser.phoneNumber || null,
    interests: [],
    location: { city: 'N/A', country: 'N/A' },
    hasCompletedOnboarding: authUser.hasCompletedOnboarding,
    flowers: 0,
    isVerified: false
  } : null;

  const [showBuyPetalsModal, setShowBuyPetalsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'events' | 'messages' | 'profile'>(() => {
    switch (location.pathname) {
      case '/app/messages':
        return 'messages';
      case '/app/events':
        return 'events';
      case '/app/profile':
        return 'profile';
      case '/app/dashboard':
      case '/app':
      default:
        return 'discover';
    }
  });

  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };

    window.addEventListener('setActiveTab', handleTabChange);
    return () => window.removeEventListener('setActiveTab', handleTabChange);
  }, []);

  // TODO: handleSwipe function removed as it's currently unused
  // This function handles user interactions (like, dislike, contact request)
  // Should be implemented when swipe functionality is added to SwipeContainer

  const createConversationForUser = (selectedUser: User) => {
    if (!selectedUser) return [];
    
    return [{
      user: selectedUser,
      lastMessage: t('messages.firstMessage', { ns: 'dashboard' }),
      timestamp: new Date().toISOString(),
      unreadCount: 0
    }];
  };

  const conversations = location.state?.recipient
    ? createConversationForUser(location.state.recipient)
    : [];

  const handleShare = (eventId: string) => {
    console.log('Share event:', eventId);
  };

  const handleJoin = (eventId: string) => {
    console.log('Join event:', eventId);
  };

  const handleSelectConversation = (selectedUser: User) => {
    navigate('/app/messages', {
      state: {
        activeTab: 'messages',
        recipient: selectedUser
      }
    });
  };

  const handleCreateEvent = async (eventData: CreateEventData) => {
    if (!user) throw new Error(t('errors.mustBeLoggedIn'));
    
    const fullEventData: Omit<NewEventWithAuth, 'creator'> = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      location: eventData.location,
      coverImage: eventData.coverImage,
      maxParticipants: eventData.maxParticipants || 0,
      entryFee: eventData.entryFee || 0
    };

    const createdEvent = await createEvent(fullEventData);
    return createdEvent;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'messages':
        return location.state?.recipient ? (
          <ChatContainer
            recipient={location.state.recipient}
            onBack={() => navigate('/app/messages')}
            userBalance={0}
            onNavigateToStore={() => console.log('Navigate to store')}
            onNavigateToEvents={() => setActiveTab('events')}
          />
        ) : (
          <ConversationGarden
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            selectedUser={location.state?.recipient}
          />
        );
      case 'discover':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 relative">
              <div className="fixed bottom-[5rem] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
                <SwipeContainer />
              </div>
            </div>

            {showBuyPetalsModal && user && (
              <BuyPetalsModal
                isOpen={showBuyPetalsModal}
                onClose={() => setShowBuyPetalsModal(false)}
                user={user}
              />
            )}
            {showWithdrawModal && user && (
              <FlowersModal
                user={user}
                flowers={user.flowers || 0}
                isOpen={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
              />
            )}
          </div>
        );
      case 'profile':
        return <UserProfile />;
      case 'events':
        return (
          <EventsList
            events={events}
            currentUserId={user?.id || ''}
            onShare={handleShare}
            onJoin={handleJoin}
            onCreateEvent={handleCreateEvent}
            onRateEvent={rateEvent}
            initialShowModal={false}
          />
        );
      default:
        return <SwipeContainer />;
    }
  };

  const renderTab = (tab: 'discover' | 'events' | 'messages' | 'profile', icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        flex flex-col items-center px-3 py-1.5 transition-all duration-300 ease-in-out
        relative overflow-hidden rounded-lg
        ${activeTab === tab
          ? 'text-white bg-gradient-to-r from-rose-400 to-amber-300 scale-110 shadow-lg'
          : 'text-gray-500 hover:text-rose-400 hover:scale-105'
        }
      `}
    >
      <div className={`
        transform transition-all duration-300 mb-0.5
        ${activeTab === tab ? 'scale-110 animate-pulse' : 'scale-100 hover:scale-105'}
      `}>
        {icon}
      </div>
      <span className={`
        text-xs font-medium tracking-wide transition-opacity duration-300
        ${activeTab === tab ? 'opacity-100' : 'opacity-70'}
      `}>
        {label}
      </span>
      {activeTab === tab && (
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-400/30 via-pink-400/20 to-amber-300/30 blur-xl animate-gradient-shift -z-10" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto pb-24 mb-2">
        {loading && <div className="p-4">{t('common.loading')}</div>}
        {error && <div className="p-4 text-red-500">{t('errors.networkError')}</div>}
        <div className="container mx-auto px-4 py-6">
          {renderContent()}
        </div>
      </div>
      
      <nav className="fixed bottom-0 w-full px-4 py-2 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg transform transition-transform duration-300 ease-in-out mx-auto rounded-t-2xl">
        <div className="container mx-auto px-2">
          <div className="flex justify-around items-center max-w-md mx-auto relative">
            {renderTab('discover', <HeartHandshake className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.discover'))}
            {renderTab('events', <PartyPopper className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.events'))}
            {renderTab('messages', <Sparkles className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.messages'))}
            {renderTab('profile', <UserCircle2 className="w-6 h-6 stroke-[1.5]" />, t('dashboard.tabs.profile'))}
          </div>
        </div>
      </nav>
    </div>
  );
}
