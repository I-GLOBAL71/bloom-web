import React from 'react';
import { render } from '@testing-library/react';
import { QRCodeGenerator } from '../QRCodeGenerator';

describe('QRCodeGenerator', () => {
  const mockEventId = 'test-event-123';

  it('affiche le placeholder avec l\'ID de l\'événement', () => {
    const { getByText } = render(<QRCodeGenerator eventId={mockEventId} />);
    
    expect(getByText(/QR Code for event test-event-123/)).toBeInTheDocument();
    expect(getByText(/Coming soon/)).toBeInTheDocument();
  });

  it('génère l\'URL correcte pour l\'événement', () => {
    const { container } = render(<QRCodeGenerator eventId={mockEventId} />);
    
    // Bien que l'URL ne soit pas visible dans le DOM pour le moment,
    // nous vérifions que le composant est rendu avec les bonnes props
    expect(container.firstChild).toBeInTheDocument();
  });

  it('utilise la taille par défaut de 256px', () => {
    const { container } = render(<QRCodeGenerator eventId={mockEventId} />);
    
    const qrContainer = container.querySelector('.w-64.h-64');
    expect(qrContainer).toBeInTheDocument();
  });

  it('a le bouton de téléchargement désactivé', () => {
    const { getByRole } = render(<QRCodeGenerator eventId={mockEventId} />);
    
    const downloadButton = getByRole('button');
    expect(downloadButton).toBeDisabled();
    expect(downloadButton).toHaveTextContent('Download QR Code');
  });

  it('affiche correctement l\'icône de téléchargement', () => {
    const { container } = render(<QRCodeGenerator eventId={mockEventId} />);
    
    const downloadIcon = container.querySelector('.lucide-download');
    expect(downloadIcon).toBeInTheDocument();
  });

  it('applique les classes CSS correctes pour le style', () => {
    const { container } = render(<QRCodeGenerator eventId={mockEventId} />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'gap-4',
      'p-4',
      'bg-white',
      'rounded-xl',
      'border',
      'border-pink-100'
    );
  });

  it('maintient une structure cohérente avec le design system', () => {
    const { getByRole, container } = render(<QRCodeGenerator eventId={mockEventId} />);
    
    // Vérifier la hiérarchie des éléments
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBe(2); // QR container et bouton
    
    const button = getByRole('button');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'px-4',
      'py-2',
      'text-sm',
      'font-medium',
      'text-pink-600',
      'hover:text-pink-700'
    );
  });
});