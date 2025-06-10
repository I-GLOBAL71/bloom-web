import React, { useState } from 'react';
import { Send, Gift, CreditCard } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { ImageUpload } from './ImageUpload';
import { FileUpload } from './FileUpload';
import { EmojiPicker } from './EmojiPicker';

interface MessageInputProps {
  onSend: (message: string) => void;
  onSendFlower?: () => void;
  petals: number;
}

export function MessageInput({ onSend, onSendFlower, petals }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showPetalInfo, setShowPetalInfo] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  const handleEmojiSelect = (emoji: string) => {
    const newMessage = 
      message.slice(0, cursorPosition) + 
      emoji + 
      message.slice(cursorPosition);
    setMessage(newMessage);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Actions toolbar */}
      <div className="flex items-center justify-between sm:justify-start gap-2 px-2 py-1.5 sm:py-0">
        <div className="flex items-center gap-1">
          <ImageUpload onImageSelect={(file) => console.log('Image selected:', file)} />
          <FileUpload onFileSelect={(file) => console.log('File selected:', file)} />
          <VoiceRecorder onRecordingComplete={(blob) => console.log('Recording complete:', blob)} />
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-pink-50 rounded-full">
            <CreditCard className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-pink-500">{petals}</span>
          </div>
          
          <button
            onClick={onSendFlower}
            className="p-2 rounded-full hover:bg-pink-50 transition-colors relative"
            onMouseEnter={() => setShowPetalInfo(true)}
            onMouseLeave={() => setShowPetalInfo(false)}
          >
            <Gift className="w-5 h-5 text-pink-500" />
            {showPetalInfo && (
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-pink-100 whitespace-nowrap text-sm">
                Send a flower (5 petals)
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Message input and send button */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setCursorPosition(e.target.selectionStart || 0);
          }}
          onSelect={(e) => {
            setCursorPosition(e.target.selectionStart || 0);
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}