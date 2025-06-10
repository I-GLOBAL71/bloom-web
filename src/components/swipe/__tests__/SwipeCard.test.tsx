import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SwipeCard } from '../SwipeCard';
import { User } from '@/types';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, drag, dragConstraints, style, ...props }: any) => (
      <div {...props} data-drag={drag} data-testid="motion-div">
        {children}
      </div>
    ),
  },
  useMotionValue: (initial: number) => ({
    set: jest.fn(),
    get: () => initial,
  }),
  useTransform: () => ({
    set: jest.fn(),
    get: () => 0,
  }),
}));

describe('SwipeCard', () => {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    photoURL: '/test-photo.jpg',
    interests: ['Music', 'Sports'],
  };

  const mockOnSwipe = jest.fn();

  beforeEach(() => {
    mockOnSwipe.mockClear();
  });

  it('affiche correctement les informations de l\'utilisateur', () => {
    render(<SwipeCard user={mockUser} onSwipe={mockOnSwipe} />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.interests.join(', '))).toBeInTheDocument();
    expect(screen.getByAltText(mockUser.name)).toHaveAttribute('src', mockUser.photoURL);
  });

  it('appelle onSwipe avec "left" lors du clic sur le bouton de rejet', async () => {
    render(<SwipeCard user={mockUser} onSwipe={mockOnSwipe} />);

    const rejectButton = screen.getByTestId('reject-button');
    await userEvent.click(rejectButton);

    expect(mockOnSwipe).toHaveBeenCalledWith('left');
  });

  it('appelle onSwipe avec "right" lors du clic sur le bouton like', async () => {
    render(<SwipeCard user={mockUser} onSwipe={mockOnSwipe} />);

    const likeButton = screen.getByTestId('like-button');
    await userEvent.click(likeButton);

    expect(mockOnSwipe).toHaveBeenCalledWith('right');
  });

  it('appelle onSwipe avec "up" lors du clic sur le bouton super like', async () => {
    render(<SwipeCard user={mockUser} onSwipe={mockOnSwipe} />);

    const superLikeButton = screen.getByTestId('super-like-button');
    await userEvent.click(superLikeButton);

    expect(mockOnSwipe).toHaveBeenCalledWith('up');
  });

  it('affiche tous les boutons d\'action', () => {
    render(<SwipeCard user={mockUser} onSwipe={mockOnSwipe} />);

    expect(screen.getByTestId('reject-button')).toBeInTheDocument();
    expect(screen.getByTestId('like-button')).toBeInTheDocument();
    expect(screen.getByTestId('super-like-button')).toBeInTheDocument();
  });

  it('possède les bonnes propriétés de mouvement', () => {
    render(<SwipeCard user={mockUser} onSwipe={mockOnSwipe} />);

    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveAttribute('data-drag', 'x');
  });
});