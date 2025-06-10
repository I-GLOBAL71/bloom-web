import React from 'react';
import { X, Instagram, Facebook, Twitter, Linkedin, Share2, Copy } from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventUrl: string;
}

export function ShareModal({ isOpen, onClose, eventTitle, eventUrl }: ShareModalProps) {
  if (!isOpen) return null;

  const socialPlatforms = [
    { name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    // TODO: Show success toast
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[90]">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Share Event</h3>
            <p className="text-gray-600 mt-1">{eventTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {socialPlatforms.map(({ name, icon: Icon, color }) => (
              <button
                key={name}
                className={`${color} text-white rounded-lg p-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={eventUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 text-gray-600 hover:text-pink-500"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <GradientButton onClick={onClose} fullWidth>
              Done
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
}