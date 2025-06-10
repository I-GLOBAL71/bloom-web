import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Wallet, Shield, AlertCircle, 
  MessageCircle, Flag, History, ChevronLeft 
} from 'lucide-react';
import type { Event } from '../../../types';
import { formatEventDate } from '../../../utils/dateUtils';
import { ParticipantsList } from './details/ParticipantsList';
import { EventReports } from './details/EventReports';
import { EventHistory } from './details/EventHistory';
import { EventActions } from './details/EventActions';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onStatusChange: (status: Event['status']) => Promise<void>;
}

export function EventDetails({ event, onBack, onStatusChange }: EventDetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'participants' | 'reports' | 'history'>('details');

  const tabs = [
    { id: 'details', label: 'Details', icon: Calendar },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'history', label: 'History', icon: History }
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {event.title}
            </h1>
            <p className="text-sm text-gray-500">ID: {event.id}</p>
          </div>
          <div className="ml-auto">
            <EventActions 
              event={event}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                ${activeTab === id
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">{formatEventDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      {event.location.address}<br />
                      {event.location.city}, {event.location.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Capacity</p>
                    <p className="text-gray-600">
                      {event.participants.length} participants
                      {event.maxParticipants && ` / ${event.maxParticipants} max`}
                    </p>
                  </div>
                </div>

                {event.entryFee && (
                  <div className="flex items-start gap-2">
                    <Wallet className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Entry Fee</p>
                      <p className="text-gray-600">{event.entryFee} petals</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Organizer</h2>
              
              <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
                <img
                  src={event.organizer.photos[0]}
                  alt={event.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{event.organizer.name}</p>
                  <p className="text-sm text-gray-600">
                    {event.organizer.location.city}, {event.organizer.location.country}
                  </p>
                </div>
                <button className="ml-auto p-2 text-gray-400 hover:text-pink-500">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Status Info */}
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Status Information</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Current Status</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${event.status === 'upcoming'
                        ? 'bg-green-100 text-green-700'
                        : event.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-gray-100 text-gray-700'}
                    `}>
                      {event.status}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">
                      {formatEventDate(event.createdAt)}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900">
                      {formatEventDate(event.updatedAt)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <ParticipantsList participants={event.participants} />
        )}

        {activeTab === 'reports' && (
          <EventReports eventId={event.id} />
        )}

        {activeTab === 'history' && (
          <EventHistory eventId={event.id} />
        )}
      </div>
    </div>
  );
}