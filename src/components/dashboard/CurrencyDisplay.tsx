import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Wallet } from 'lucide-react';
import { RoseIcon } from '../ui/RoseIcon';
import { GradientButton } from '../ui/GradientButton';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types';

interface CurrencyDisplayProps {
  petals: number;
  flowers: number;
  onBuyPetals?: () => void;
  onWithdrawFlowers?: () => void;
}

export function CurrencyDisplay({ petals, flowers, onBuyPetals, onWithdrawFlowers }: CurrencyDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current && 
      buttonRef.current && 
      !menuRef.current.contains(event.target as Node) && 
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBuyPetals = () => {
    setIsExpanded(false);
    onBuyPetals?.();
  };

  const handleWithdrawFlowers = () => {
    setIsExpanded(false);
    onWithdrawFlowers?.();
  };

  return (
    <div className="relative">
      {/* Mobile Display */}
      <button
        ref={buttonRef}
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden flex items-center justify-center w-10 h-10 bg-gradient-to-r from-pink-100 to-red-100 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Wallet className="w-5 h-5 text-pink-600" />
        <span className="sr-only">Afficher votre solde</span>
      </button>

      {/* Expanded Mobile Menu */}
      {isExpanded && (
        <div 
          ref={menuRef}
          className="md:hidden absolute top-full right-0 mt-2 p-2 bg-white rounded-xl shadow-lg border border-red-100 min-w-[200px] z-[2000]"
        >
          <div className="space-y-2">
            <button
              onClick={handleBuyPetals}
              className="w-full flex items-center justify-between p-2 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-pink-500" />
                </div>
                <span className="text-sm text-gray-600">Petals</span>
              </div>
              <span className="font-medium text-gray-900">{petals}</span>
            </button>
            
            <button
              onClick={handleWithdrawFlowers}
              className="w-full flex items-center justify-between p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <RoseIcon size={16} />
                </div>
                <span className="text-sm text-gray-600">Flowers</span>
              </div>
              <span className="font-medium text-gray-900">{flowers}</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Display */}
      <div className="hidden md:flex items-center gap-4 text-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBuyPetals}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <Leaf className="w-4 h-4 text-pink-500" />
            <span className="font-medium text-pink-600">{petals}</span>
          </button>
          <button
            onClick={onWithdrawFlowers}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <RoseIcon size={16} />
            <span className="font-medium text-red-700">{flowers}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
