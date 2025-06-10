import { render, screen, act, cleanup } from '@testing-library/react';
import { SwipeContainer } from '../SwipeContainer';
import { User } from '@/types';

jest.mock('../SwipeCard', () => ({
  SwipeCard: ({ user, onSwipe }: { user: User; onSwipe: (direction: 'left' | 'right' | 'up') => void }) => (
    <div data-testid={`swipe-card-${user.id}`}>
      <span>{user.name}</span>
      <button data-testid={`reject-${user.id}`} onClick={() => onSwipe('left')}>
        Rejeter
      </button>
      <button data-testid={`like-${user.id}`} onClick={() => onSwipe('right')}>
        Like
      </button>
      <button data-testid={`super-like-${user.id}`} onClick={() => onSwipe('up')}>
        Super Like
      </button>
    </div>
  ),
}));

describe('SwipeContainer', () => {
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Test User 1',
      photoURL: 'test1.jpg',
      interests: ['Music', 'Sports']
    },
    {
      id: '2',
      name: 'Test User 2',
      photoURL: 'test2.jpg',
      interests: ['Movies', 'Travel']
    }
  ];

  const mockOnSwipe = jest.fn();

  beforeEach(() => {
    mockOnSwipe.mockClear();
    cleanup();
  });

  it('affiche correctement les cartes des utilisateurs', () => {
    render(
      <SwipeContainer 
        users={mockUsers}
        onSwipe={mockOnSwipe}
      />
    );
    
    expect(screen.getByTestId('swipe-card-1')).toBeInTheDocument();
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
  });

  it('gère correctement un tableau vide d\'utilisateurs', () => {
    render(
      <SwipeContainer 
        users={[]}
        onSwipe={mockOnSwipe}
      />
    );
    
    expect(screen.queryByTestId(/swipe-card/)).not.toBeInTheDocument();
    expect(screen.getByText(/Plus de profils disponibles/i)).toBeInTheDocument();
  });

  it('appelle onSwipe avec le bon userId et les bonnes directions', async () => {
    const { unmount } = render(
      <SwipeContainer 
        users={mockUsers}
        onSwipe={mockOnSwipe}
      />
    );

    // Test du swipe gauche
    await act(async () => {
      const rejectButton = screen.getByTestId('reject-1');
      rejectButton.click();
    });
    expect(mockOnSwipe).toHaveBeenCalledWith('1', 'left');

    // Vérifie que le deuxième utilisateur est maintenant le premier affiché
    await act(async () => {
      const likeButton = screen.getByTestId('like-2');
      likeButton.click();
    });
    expect(mockOnSwipe).toHaveBeenCalledWith('2', 'right');

    // Nettoyer le rendu précédent
    unmount();

    // Test du super like
    render(
      <SwipeContainer 
        users={mockUsers}
        onSwipe={mockOnSwipe}
      />
    );

    await act(async () => {
      const superLikeButton = screen.getByTestId('super-like-1');
      superLikeButton.click();
    });
    expect(mockOnSwipe).toHaveBeenCalledWith('1', 'up');

    // Vérifie que le message s'affiche quand il n'y a plus de profils
    cleanup();
    render(
      <SwipeContainer 
        users={[]}
        onSwipe={mockOnSwipe}
      />
    );

    const noMoreProfilesMessage = screen.getByText(/Plus de profils disponibles/i);
    expect(noMoreProfilesMessage).toBeInTheDocument();
  });
});