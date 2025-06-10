import React, { useState } from 'react';
import { Smile } from 'lucide-react';

const EMOJI_CATEGORIES = {
  flowers: ['🌸', '🌺', '🌹', '🌷', '🌻', '💐', '🌼', '🪷'],
  hearts: ['❤️', '💖', '💝', '💕', '💗', '💓', '💘', '💞'],
  nature: ['🦋', '🐝', '🌿', '🍃', '🌱', '🌳', '🌲', '🍂']
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-pink-50 transition-colors relative"
        title="Add emoji"
      >
        <Smile className="w-5 h-5 text-pink-500" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-lg shadow-lg border border-pink-100">
          <div className="flex gap-2 w-max">
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <div key={category} className="flex flex-col gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onEmojiSelect(emoji);
                      setIsOpen(false);
                    }}
                    className="p-1.5 hover:bg-pink-50 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
