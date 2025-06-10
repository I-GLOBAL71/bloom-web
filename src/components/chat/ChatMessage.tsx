import React, { useState } from 'react';
import FlowerGift from './FlowerGift';
import { RoseIcon } from '../ui/RoseIcon';

interface ChatMessageProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  sender?: string;
  onSendFlower?: (count: number) => void;
  flowerGift?: {
    count: number;
    value: number;
  };
  file?: {
    name: string;
    url: string;
  };
  image?: {
    url: string;
  };
  voiceMessage?: {
    url: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  timestamp,
  isOwn,
  sender,
  onSendFlower,
  flowerGift,
  file,
  image,
  voiceMessage
}) => {
  const [showFlowerMenu, setShowFlowerMenu] = useState(false);

  const handleSendFlower = (count: number) => {
    onSendFlower?.(count);
    setShowFlowerMenu(false);
  };

  const renderContent = () => {
    if (flowerGift) {
      return (
        <FlowerGift
          count={flowerGift.count}
          value={flowerGift.value}
          isReceived={!isOwn}
        />
      );
    }

    if (file) {
      return (
        <div className={`p-3 rounded-lg ${
          isOwn ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm' : 'bg-white/90 backdrop-blur-sm border border-rose-100 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            <span role="img" aria-label="fichier" className="opacity-80">📎</span>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${isOwn ? 'text-white/90 hover:text-white' : 'text-rose-600 hover:text-rose-700'}`}
            >
              {file.name}
            </a>
          </div>
          <span className={`text-xs mt-1 block ${isOwn ? 'text-white/70' : 'text-rose-500/70'}`}>
            {timestamp}
          </span>
        </div>
      );
    }

    if (image) {
      return (
        <div className={`rounded-lg overflow-hidden max-w-xs`}>
          <img 
            src={image.url} 
            alt="Message" 
            className="w-full h-auto"
          />
          <div className={`px-3 py-1 ${
            isOwn ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white/70' : 'bg-white/90 backdrop-blur-sm text-rose-500/70 border-t border-rose-100'
          }`}>
            <span className="text-xs">{timestamp}</span>
          </div>
        </div>
      );
    }

    if (voiceMessage) {
      return (
        <div className={`p-3 rounded-lg ${
          isOwn ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm' : 'bg-white/90 backdrop-blur-sm border border-rose-100 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            <span role="img" aria-label="audio">🎤</span>
            <audio controls className="h-8">
              <source src={voiceMessage.url} type="audio/webm" />
              Votre navigateur ne supporte pas l'élément audio.
            </audio>
          </div>
          <span className={`text-xs mt-1 block ${isOwn ? 'text-white/70' : 'text-rose-500/70'}`}>
            {timestamp}
          </span>
        </div>
      );
    }

    return (
      <div className={`p-3 rounded-lg ${
        isOwn ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm' : 'bg-white/90 backdrop-blur-sm border border-rose-100 text-rose-900'
      }`}>
        <p>{content}</p>
        <span className={`text-xs mt-1 block ${isOwn ? 'text-red-100' : 'text-gray-500'}`}>
          {timestamp}
        </span>
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-4`}>
      {!isOwn && sender && (
        <span className="text-sm text-rose-600/70 mb-1">{sender}</span>
      )}
      
      <div className="flex items-end gap-2">
        {!isOwn && !flowerGift && (
          <button
            onClick={() => setShowFlowerMenu(!showFlowerMenu)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-all shadow-sm hover:shadow-md"
            title="Envoyer une fleur"
          >
            <RoseIcon size={16} />
          </button>
        )}

        <div className="max-w-[70%]">
          {renderContent()}
        </div>
      </div>

      {showFlowerMenu && (
        <div className="mt-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-rose-100">
          <div className="grid grid-cols-3 gap-2">
            {[1, 3, 5].map((count) => (
              <button
                key={count}
                onClick={() => handleSendFlower(count)}
                className="flex flex-col items-center p-2 hover:bg-rose-50 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-center relative">
                  {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        transform: `translateX(${(index - 1) * 12}px) rotate(${
                          index % 2 === 0 ? -8 : 8
                        }deg)`
                      }}
                    >
                      <RoseIcon size={16} />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 mt-6">
                  {count} {count > 1 ? 'fleurs' : 'fleur'}
                </span>
                <span className="text-xs text-red-700">
                  {(count * 0.5).toFixed(2)}€
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;