import React, { useState } from 'react';
import { Mic, Square, Timer } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    // Mock recording for now
    const interval = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    
    // Cleanup after 1 minute (mock)
    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
      setDuration(0);
      // Mock audio blob
      onRecordingComplete(new Blob());
    }, 60000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setDuration(0);
    // Mock audio blob
    onRecordingComplete(new Blob());
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <>
          <div className="flex items-center gap-2 text-pink-500">
            <Timer className="w-4 h-4" />
            <span>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
          </div>
          <button
            onClick={stopRecording}
            className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
          >
            <Square className="w-4 h-4 text-white" />
          </button>
        </>
      ) : (
        <button
          onClick={startRecording}
          className="p-2 rounded-full hover:bg-pink-50 transition-colors"
        >
          <Mic className="w-5 h-5 text-pink-500" />
        </button>
      )}
    </div>
  );
}