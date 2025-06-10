import React from 'react';
import { RoseIcon } from '../ui/RoseIcon';

interface FlowerGiftProps {
  count: number;
  value: number;
  currency?: string;
  onSend?: () => void;
  isReceived?: boolean;
}

const FlowerGift: React.FC<FlowerGiftProps> = ({
  count,
  value,
  currency = '€',
  onSend,
  isReceived = false
}) => {
  return (
    <div className={`flex items-center ${isReceived ? 'flex-row' : 'flex-row-reverse'} gap-2 p-3 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 shadow-sm`}>
      <div className="flex items-center gap-1">
        {/* Affichage des roses avec une légère rotation alternée */}
        <div className="flex">
          {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
            <div 
              key={index} 
              className="relative"
              style={{
                transform: `rotate(${index % 2 === 0 ? -8 : 8}deg)`,
                marginLeft: index > 0 ? '-8px' : '0'
              }}
            >
              <RoseIcon size={28} />
            </div>
          ))}
        </div>
        {count > 3 && (
          <span className="text-sm font-medium text-red-700 ml-1">+{count - 3}</span>
        )}
      </div>
      
      <div className={`flex flex-col ${isReceived ? 'items-start' : 'items-end'}`}>
        <span className="text-sm font-medium text-gray-800">
          {isReceived ? 'Reçu' : 'Envoyer'} {count} {count > 1 ? 'fleurs' : 'fleur'}
        </span>
        <span className="text-xs text-red-700">
          Valeur : {value.toFixed(2)}{currency}
        </span>
      </div>

      {!isReceived && onSend && (
        <button
          onClick={onSend}
          className="ml-2 px-3 py-1 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-full transition-colors"
        >
          Offrir
        </button>
      )}
    </div>
  );
};

export default FlowerGift;