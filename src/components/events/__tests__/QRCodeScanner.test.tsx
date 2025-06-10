import { render, screen, fireEvent, act } from '@testing-library/react';
import { QRCodeScanner } from '../QRCodeScanner';

const mockOnScan = jest.fn();
const mockOnClose = jest.fn();

describe('QRCodeScanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche correctement l\'interface initiale', () => {
    render(
      <QRCodeScanner
        onScan={mockOnScan}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Scan Event QR Code')).toBeInTheDocument();
    expect(screen.getByText('Point your camera at the event QR code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Scan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('gère correctement le processus de scan réussi', async () => {
    const { getByRole } = render(
      <QRCodeScanner
        onScan={mockOnScan}
        onClose={mockOnClose}
      />
    );

    const scanButton = getByRole('button', { name: 'Scan' });
    fireEvent.click(scanButton);

    // Vérifie que le bouton est désactivé pendant le scan
    expect(scanButton).toBeDisabled();

    // Attend la fin du scan simulé
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1100));
    });

    expect(mockOnScan).toHaveBeenCalledWith('mock-qr-data');
    expect(scanButton).not.toBeDisabled();
  });

  it('gère correctement la fermeture', () => {
    const { getByRole } = render(
      <QRCodeScanner
        onScan={mockOnScan}
        onClose={mockOnClose}
      />
    );

    const cancelButton = getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('désactive le bouton de scan pendant le processus', async () => {
    const { getByRole } = render(
      <QRCodeScanner
        onScan={mockOnScan}
        onClose={mockOnClose}
      />
    );

    const scanButton = getByRole('button', { name: 'Scan' });
    fireEvent.click(scanButton);

    // Vérifie que le bouton est désactivé pendant le scan
    expect(scanButton).toBeDisabled();

    // Attend la fin du scan simulé
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1100));
    });

    // Vérifie que le bouton est réactivé
    expect(scanButton).not.toBeDisabled();
  });
});