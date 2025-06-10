import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ImageUpload } from './ImageUpload';
import { VoiceRecorder } from './VoiceRecorder';
import FlowerGift from './FlowerGift';
import { FlowerConfirmationModal } from './FlowerConfirmationModal';

interface ChatActionsProps {
  onEmojiSelect: (emoji: string) => void;
  onFileUpload: (file: File) => void;
  onImageUpload: (image: File) => void;
  onVoiceRecord: (audioBlob: Blob) => void;
  onSendFlower: (count: number) => void;
  onBuyFlowers?: () => void;
  userBalance?: number;
}

const EMOJI_CATEGORIES = {
  "Emotions": ["😊", "😂", "🥰", "😍", "😎", "🤗", "😄", "🥺", "😇", "🤩", "😘", "😋", "🤔", "😉", "😌"],
  "Coeurs": ["❤️", "💖", "💝", "💕", "💓", "💗", "💞", "💘", "💋", "💟", "💌", "💜", "💙", "💚", "💛"],
  "Fleurs": ["🌹", "🌸", "💐", "🌺", "🌷", "🌻", "🌼", "🌿", "🍀", "🌾", "🌱", "🌲", "🌳", "🌴", "🌵"],
  "Gestes": ["👋", "🤝", "👍", "👏", "🙌", "✌️", "🤞", "👌", "🤟", "🤙", "💪", "🙏", "👆", "👊", "✨"]
};

const FLOWER_COST = 0.5; // Coût par fleur en euros

export function ChatActions({
  onEmojiSelect,
  onFileUpload,
  onImageUpload,
  onVoiceRecord,
  onSendFlower,
  onBuyFlowers,
  userBalance = 0
}: ChatActionsProps) {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Emotions");
  const [showFlowerConfirmation, setShowFlowerConfirmation] = useState(false);
  const [selectedFlowerCount, setSelectedFlowerCount] = useState(1);

  const handleFlowerGift = (count: number) => {
    setSelectedFlowerCount(count);
    setShowFlowerConfirmation(true);
  };

  const handleFlowerConfirm = () => {
    onSendFlower(selectedFlowerCount);
    setShowFlowerConfirmation(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Emoji et Fleurs toujours visibles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-full hover:bg-gray-100 ${
              showEmojiPicker ? 'bg-gray-100' : ''
            }`}
          >
            <span role="img" aria-label="emoji">😊</span>
          </button>
          
          <button
            onClick={() => handleFlowerGift(1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <span role="img" aria-label="flower">🌹</span>
          </button>
        </div>

        {/* Séparateur vertical */}
        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* Menu déroulant pour les autres actions */}
        <div className="relative">
          <button
            onClick={() => setShowMoreActions(!showMoreActions)}
            className={`p-2 rounded-full hover:bg-gray-100 ${
              showMoreActions ? 'bg-gray-100' : ''
            }`}
          >
            <span role="img" aria-label="more">⚡</span>
          </button>

          {showMoreActions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 min-w-[200px]">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files?.[0]) onFileUpload(files[0]);
                    };
                    input.click();
                  }}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span role="img" aria-label="file">📎</span>
                  <span>Fichier</span>
                </button>

                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files?.[0]) onImageUpload(files[0]);
                    };
                    input.click();
                  }}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span role="img" aria-label="image">🖼️</span>
                  <span>Image</span>
                </button>

                <button
                  onClick={() => onVoiceRecord(new Blob())}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span role="img" aria-label="voice">🎤</span>
                  <span>Message vocal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sélecteur d'emojis étendu */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 min-w-[320px]">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
              <button
                key={emoji}
                onClick={() => onEmojiSelect(emoji)}
                className="p-2 hover:bg-gray-100 rounded text-xl"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal de confirmation pour l'envoi de fleurs */}
      {showFlowerConfirmation && (
        <FlowerConfirmationModal
          flowerCount={selectedFlowerCount}
          cost={selectedFlowerCount * FLOWER_COST}
          userBalance={userBalance}
          onConfirm={handleFlowerConfirm}
          onCancel={() => setShowFlowerConfirmation(false)}
          onBuyFlowers={onBuyFlowers}
          onFlowerCountChange={(count: number) => {
            console.log('ChatActions: Updating flower count to:', count);
            setSelectedFlowerCount(count);
          }}
        />
      )}
    </div>
  );
}