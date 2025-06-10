import React, { useEffect } from 'react';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeData {
  eventId: string;
  userId: string;
  paymentId: string;
  timestamp: number;
}

interface QRCodeGeneratorProps {
  eventId?: string;
  codeData?: QRCodeData;
  size?: number;
}

export function QRCodeGenerator({ eventId, codeData, size = 256 }: QRCodeGeneratorProps) {
  const [qrUrl, setQrUrl] = React.useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const value = codeData 
          ? JSON.stringify(codeData)
          : `bloom://event/${eventId}`;
        
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrUrl(url);
      } catch (err) {
        console.error('Erreur lors de la génération du QR code:', err);
      }
    };

    generateQR();
  }, [eventId, codeData, size]);

  const handleDownload = () => {
    if (!qrUrl) return;
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-code-${codeData?.eventId || eventId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-xl border border-pink-100">
      {qrUrl ? (
        <img 
          src={qrUrl}
          alt="QR Code"
          className="w-64 h-64 rounded-lg"
        />
      ) : (
        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center p-4">
          Génération du QR code...
        </div>
      )}
      
      <button
        onClick={handleDownload}
        disabled={!qrUrl}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        <span>Télécharger le QR Code</span>
      </button>
    </div>
  );
}