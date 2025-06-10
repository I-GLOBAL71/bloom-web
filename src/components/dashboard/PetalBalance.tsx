import React from 'react';
import { CreditCard } from 'lucide-react';
import { RoseIcon } from '../ui/RoseIcon';
import { GradientButton } from '../ui/GradientButton';

interface PetalBalanceProps {
  className?: string;
  petals: number;
  flowers: number;
  onBuyPetals: () => void;
  onWithdrawFlowers: () => void;
}

export function PetalBalance({ className = '', petals, flowers, onBuyPetals, onWithdrawFlowers }: PetalBalanceProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-3 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Petals Balance</p>
            <p className="text-lg font-semibold text-gray-900">{petals}</p>
          </div>
        </div>
        <GradientButton onClick={onBuyPetals} size="sm">
          Buy More
        </GradientButton>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <RoseIcon size={16} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Flowers Earned</p>
            <p className="text-lg font-semibold text-gray-900">{flowers}</p>
          </div>
        </div>
        <GradientButton onClick={onWithdrawFlowers} variant="secondary" size="sm">
          Withdraw
        </GradientButton>
      </div>
    </div>
  );
}