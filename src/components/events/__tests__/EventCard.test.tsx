import { render, screen } from '@testing-library/react';
import { Event } from '@/types';
import { EventCard } from '../EventCard';

describe('EventCard', () => {
  const mockEvent: Event = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    date: new Date('2025-01-01T14:00:00'),
    location: {
      address: '123 Test Street',
      city: 'Test City',
      coordinates: { lat: 0, lng: 0 }
    },
    imageUrl: 'test-image.jpg',
    maxParticipants: 5,
    currentParticipants: 1,
    price: 10,
    creator: {
      id: '1',
      name: 'Test User',
      photoURL: 'test-photo.jpg'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockOnJoin = jest.fn();

  beforeEach(() => {
    mockOnJoin.mockClear();
  });

  it('affiche correctement le nombre de participants', () => {
    render(
      <EventCard 
        event={mockEvent}
        onJoin={mockOnJoin}
        isParticipant={false}
      />
    );
    
    expect(screen.getByText('1/5 places')).toBeInTheDocument();
    expect(screen.getByText('1 / 5 participants')).toBeInTheDocument();
  });

  it('affiche "Complet" quand l\'événement est plein', () => {
    const fullEvent = {
      ...mockEvent,
      currentParticipants: 5
    };
    
    render(
      <EventCard 
        event={fullEvent}
        onJoin={mockOnJoin}
        isParticipant={false}
      />
    );
    
    const badges = screen.getAllByText('Complet');
    expect(badges.length).toBeGreaterThan(0);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Complet');
  });

  it('affiche correctement le prix en pétales', () => {
    render(
      <EventCard 
        event={mockEvent}
        onJoin={mockOnJoin}
        isParticipant={false}
      />
    );
    
    expect(screen.getByText('10 pétales')).toBeInTheDocument();
  });

  it('affiche correctement la date et l\'heure', () => {
    render(
      <EventCard 
        event={mockEvent}
        onJoin={mockOnJoin}
        isParticipant={false}
      />
    );
    
    expect(screen.getByText('1 janvier 2025')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('affiche correctement l\'adresse', () => {
    render(
      <EventCard 
        event={mockEvent}
        onJoin={mockOnJoin}
        isParticipant={false}
      />
    );
    
    expect(screen.getByText('123 Test Street, Test City')).toBeInTheDocument();
  });

  it('affiche "Déjà inscrit" quand l\'utilisateur est participant', () => {
    render(
      <EventCard 
        event={mockEvent}
        onJoin={mockOnJoin}
        isParticipant={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Déjà inscrit');
  });
});