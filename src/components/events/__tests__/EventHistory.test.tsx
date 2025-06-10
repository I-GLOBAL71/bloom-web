import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventHistory } from '../EventHistory';
import { formatEventDate } from '../../../utils/dateUtils';
import type { Event, User } from '../../../types';

// Mock des dépendances
jest.mock('../../../utils/dateUtils', () => ({
  formatEventDate: jest.fn().mockReturnValue('1 janvier 2025'),
}));

jest.mock('../EventRating', () => ({
  EventRating: ({ eventId, onRate }: { eventId: string; onRate: (rating: number) => void }) => (
    <button onClick={() => onRate(5)} data-testid={`rate-event-${eventId}`}>
      Noter l'événement
    </button>
  ),
}));

describe('EventHistory', () => {
  const mockOrganizer: User = {
    id: 'user1',
    name: 'Test Organizer',
    email: 'test@example.com',
    age: '25',
    gender: 'other',
    interestedIn: ['other'],
    interests: ['music'],
    profession: 'Developer',
    phone: '123456789',
    photos: ['photo.jpg'],
    location: {
      city: 'Test City',
      country: 'Test Country'
    },
    lastActive: new Date(),
    createdAt: new Date()
  };

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);

  const mockEvents: Event[] = [
    {
      id: 'event1',
      title: 'Événement passé',
      description: 'Description de l\'événement passé',
      date: pastDate,
      time: '14:00',
      location: {
        address: '123 Past Street',
        city: 'Past City',
        country: 'Past Country'
      },
      coverImage: 'past-event.jpg',
      participants: [mockOrganizer],
      maxParticipants: 10,
      entryFee: 0,
      organizer: mockOrganizer,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'event2',
      title: 'Événement futur',
      description: 'Description de l\'événement futur',
      date: futureDate,
      location: {
        address: '123 Future Street',
        city: 'Future City',
        country: 'Future Country'
      },
      participants: [mockOrganizer],
      maxParticipants: 5,
      entryFee: 10,
      organizer: mockOrganizer,
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockOnRate = jest.fn().mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche un message quand il n\'y a pas d\'événements passés', () => {
    const { getByText } = render(
      <EventHistory events={[mockEvents[1]]} onRate={mockOnRate} />
    );

    expect(getByText('Aucun événement passé à afficher')).toBeInTheDocument();
  });

  it('affiche correctement les événements passés', () => {
    const { getByText, getByAltText } = render(
      <EventHistory events={mockEvents} onRate={mockOnRate} />
    );

    // Vérifie que l'événement passé est affiché
    expect(getByText('Événement passé')).toBeInTheDocument();
    expect(getByText('Description de l\'événement passé')).toBeInTheDocument();
    expect(getByAltText('Événement passé')).toBeInTheDocument();

    // Vérifie que l'événement futur n'est pas affiché
    expect(() => getByText('Événement futur')).toThrow();
  });

  it('affiche correctement les détails de l\'événement', () => {
    const { getByText } = render(
      <EventHistory events={mockEvents} onRate={mockOnRate} />
    );

    expect(getByText('1 janvier 2025')).toBeInTheDocument();
    expect(getByText('14:00')).toBeInTheDocument();
    expect(getByText('123 Past Street, Past City')).toBeInTheDocument();
    expect(getByText('1 / 10 participants')).toBeInTheDocument();
  });

  it('gère correctement l\'absence d\'image de couverture', () => {
    const eventSansImage = {
      ...mockEvents[0],
      id: 'event3',
      coverImage: undefined
    };

    const { container } = render(
      <EventHistory events={[eventSansImage]} onRate={mockOnRate} />
    );

    // Vérifie que le div de fallback est présent
    expect(container.querySelector('.from-pink-500\\/20')).toBeInTheDocument();
  });

  it('appelle correctement la fonction onRate', async () => {
    const { getByTestId } = render(
      <EventHistory events={mockEvents} onRate={mockOnRate} />
    );

    const ratingButton = getByTestId('rate-event-event1');
    await userEvent.click(ratingButton);

    expect(mockOnRate).toHaveBeenCalledWith('event1', 5);
  });

  it('affiche le statut correct pour les événements terminés', () => {
    const { getByText } = render(
      <EventHistory events={mockEvents} onRate={mockOnRate} />
    );

    expect(getByText('Terminé')).toBeInTheDocument();
  });

  it('maintient une structure cohérente avec le design system', () => {
    const { container } = render(
      <EventHistory events={mockEvents} onRate={mockOnRate} />
    );

    // Vérifie la structure de la grille
    expect(container.firstChild).toHaveClass('grid', 'gap-6', 'md:grid-cols-2');

    // Vérifie la structure de la carte d'événement
    const eventCard = container.querySelector('.rounded-xl');
    expect(eventCard).toHaveClass(
      'bg-white',
      'rounded-xl',
      'shadow-lg',
      'overflow-hidden',
      'border',
      'border-pink-100'
    );
  });
});