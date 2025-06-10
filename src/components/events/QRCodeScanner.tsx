import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import jsQR from 'jsqr';
import { savePaymentTransaction, updateUserBalance } from '../../lib/firebase/users';
import { useAuth } from '../../contexts/AuthContext';

interface QRCodeScannerProps {
  eventId: string;
  onClose: () => void;
  onScanComplete: () => void;
}

export function QRCodeScanner({ eventId, onClose, onScanComplete }: QRCodeScannerProps) {
  const { t } = useTranslation('events');
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setScanning(true);
        }
      } catch (err) {
        console.error('Erreur d\'accès à la caméra:', err);
        setError(t('scanner.cameraError'));
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [t]);

  const processFrame = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      handleQRCode(code.data);
    } else {
      requestAnimationFrame(processFrame);
    }
  };

  const handleQRCode = async (data: string) => {
    try {
      const qrData = JSON.parse(data);
      
      // Vérifier que le QR code correspond à l'événement
      if (qrData.eventId !== eventId) {
        setError(t('scanner.invalidEvent'));
        return;
      }

      // Vérifier que l'organisateur est autorisé
      if (!user?.id) {
        setError(t('scanner.unauthorized'));
        return;
      }

      // Marquer le paiement comme complété
      await savePaymentTransaction({
        eventId: qrData.eventId,
        userId: qrData.userId,
        paymentId: qrData.paymentId,
        amount: qrData.amount,
        status: 'completed'
      });

      // Transférer les fleurs à l'organisateur
      await updateUserBalance(user.id, qrData.amount);

      setSuccess(true);
      setTimeout(() => {
        onScanComplete();
      }, 2000);

    } catch (err) {
      console.error('Erreur lors du traitement du QR code:', err);
      setError(t('scanner.processingError'));
    }
  };

  useEffect(() => {
    if (scanning && !success && !error) {
      requestAnimationFrame(processFrame);
    }
  }, [scanning, success, error]);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('scanner.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-square w-full bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {!scanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-12 h-12 text-white animate-pulse" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/90">
              <p className="text-white text-center p-4">{error}</p>
            </div>
          )}

          {success && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/90">
              <p className="text-white text-center p-4">
                {t('scanner.success')}
              </p>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 text-center">
            {t('scanner.instruction')}
          </p>
        </div>
      </div>
    </div>
  );
}