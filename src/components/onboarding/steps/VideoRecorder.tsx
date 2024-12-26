import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Video, StopCircle, Camera, RefreshCcw } from 'lucide-react';

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  maxDuration?: number; // en secondes
}

export function VideoRecorder({ onVideoRecorded, maxDuration = 30 }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        onVideoRecorded(blob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      setIsRecording(true);
      mediaRecorder.start();
      setTimeLeft(maxDuration);

      // Démarrer le compte à rebours
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Arrêter automatiquement après maxDuration
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, maxDuration * 1000);

    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier vos permissions.');
      console.error('Error accessing camera:', err);
    }
  }, [maxDuration, onVideoRecorded]);

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetRecording = () => {
    setPreviewUrl(null);
    setError(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="space-y-4">
      {error ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      ) : (
        <>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isRecording}
              className="w-full h-full object-cover"
              src={previewUrl || undefined}
            />
            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="animate-pulse">●</span>
                {timeLeft}s
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isRecording && !previewUrl && (
              <motion.button
                type="button"
                onClick={startRecording}
                className="px-6 py-3 bg-pink-500 text-white rounded-full flex items-center gap-2 hover:bg-pink-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-5 h-5" />
                Commencer l'enregistrement
              </motion.button>
            )}

            {isRecording && (
              <motion.button
                type="button"
                onClick={stopRecording}
                className="px-6 py-3 bg-red-500 text-white rounded-full flex items-center gap-2 hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StopCircle className="w-5 h-5" />
                Arrêter
              </motion.button>
            )}

            {previewUrl && (
              <motion.button
                type="button"
                onClick={resetRecording}
                className="px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-full flex items-center gap-2 hover:bg-pink-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCcw className="w-5 h-5" />
                Recommencer
              </motion.button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
