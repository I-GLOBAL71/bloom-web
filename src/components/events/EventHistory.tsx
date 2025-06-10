import React from 'react';
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import { EventRating } from './EventRating';
import type { Event } from '../../types';
import { formatEventDate } from '../../utils/dateUtils';

interface EventHistoryProps {
  events: Event[];
  onRate: (eventId: string, rating: number) => Promise<void>;
}

export function EventHistory({ events, onRate }: EventHistoryProps) {
  const pastEvents = events.filter(event => 
    event.status === 'completed' || new Date(event.date) < new Date()
  );

  if (pastEvents.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Aucun événement passé à afficher</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {pastEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100 hover:border-pink-300 transition-colors"
        >
          <div className="relative">
            {event.coverImage ? (
              <div className="aspect-video relative">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-rose-500/20" />
            )}
            
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-800/80 text-white">
                {event.status === 'completed' ? 'Terminé' : 'Passé'}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <EventRating
                eventId={event.id}
                onRate={onRate}
              />
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                <span>{formatEventDate(event.date)}</span>
                {event.time && (
                  <>
                    <span className="text-gray-300">•</span>
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span>{event.time}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span>
                  {event.location.address}, {event.location.city}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span>
                  {event.participants.length}
                  {event.maxParticipants && ` / ${event.maxParticipants}`} participants
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-pink-100">
              <p className="text-sm text-gray-500 line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}