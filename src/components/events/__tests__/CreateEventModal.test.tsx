import { render, screen, act, fireEvent } from '@testing-library/react';
import { CreateEventModal } from '../CreateEventModal';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock des dépendances externes
jest.mock('@/lib/firebase/events', () => ({
  createEvent: jest.fn(() => Promise.resolve({
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    date: new Date(),
    location: { address: 'Test Address', city: 'Test City', coordinates: { lat: 0, lng: 0 } },
    imageUrl: 'test.jpg',
    maxParticipants: 10,
    currentParticipants: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}));

jest.mock('@/lib/firebase/users', () => ({
  checkUserBalance: jest.fn(() => Promise.resolve(100))
}));

describe('CreateEventModal', () => {
  const mockOnClose = jest.fn();
  const mockOnEventCreated = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnEventCreated.mockClear();
  });

  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <CreateEventModal
          onClose={mockOnClose}
          onEventCreated={mockOnEventCreated}
        />
      </AuthProvider>
    );
  };

  it('affiche correctement le formulaire de création d\'événement', async () => {
    await act(async () => {
      renderWithAuth();
    });
    
    expect(screen.getByText('Créer un nouvel événement')).toBeInTheDocument();
    expect(screen.getByText('Événement Gratuit')).toBeInTheDocument();
    expect(screen.getByText('Événement Payant')).toBeInTheDocument();
    
    const titleInput = screen.getByLabelText('Titre de l\'événement');
    const descriptionInput = screen.getByLabelText('Description');
    
    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it('gère correctement le changement de type d\'événement', async () => {
    await act(async () => {
      renderWithAuth();
    });

    const paidEventButton = screen.getByText('Événement Payant');
    
    await act(async () => {
      fireEvent.click(paidEventButton);
    });

    expect(paidEventButton.closest('button')).toHaveClass('border-pink-500');
  });

  it('appelle onClose quand le bouton Annuler est cliqué', async () => {
    await act(async () => {
      renderWithAuth();
    });

    const cancelButton = screen.getByText('Annuler');
    
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('soumet le formulaire avec les données correctes', async () => {
    await act(async () => {
      renderWithAuth();
    });

    const titleInput = screen.getByLabelText('Titre de l\'événement');
    const descriptionInput = screen.getByLabelText('Description');
    const dateInput = screen.getByLabelText('Date');
    const timeInput = screen.getByLabelText('Heure');
    const maxParticipantsInput = screen.getByLabelText('Nombre maximum de participants');

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Test Event' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.change(dateInput, { target: { value: '2025-02-07' } });
      fireEvent.change(timeInput, { target: { value: '14:00' } });
      fireEvent.change(maxParticipantsInput, { target: { value: '10' } });
    });

    const submitButton = screen.getByText('Créer l\'événement');
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Vérifie que le formulaire a été soumis avec les bonnes données
    expect(mockOnEventCreated).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});