import React from 'react';
import { RoseIcon } from '../ui/RoseIcon';

interface FlowerConfirmationModalProps {
  flowerCount: number;
  cost: number;
  userBalance?: number;
  onConfirm: () => void;
  onCancel: () => void;
  onBuyFlowers?: () => void;
  onFlowerCountChange: (count: number) => void;
}

export function FlowerConfirmationModal({
  flowerCount,
  cost,
  userBalance = 0,
  onConfirm,
  onCancel,
  onBuyFlowers,
  onFlowerCountChange
}: FlowerConfirmationModalProps) {
  const hasEnoughBalance = userBalance >= cost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center relative w-24 h-24">
            {Array.from({ length: Math.min(flowerCount, 3) }).map((_, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  transform: `translate(${(index - 1) * 20}px, 0) rotate(${
                    index % 2 === 0 ? -15 : 15
                  }deg)`
                }}
              >
                <RoseIcon size={48} />
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 text-center">
            {hasEnoughBalance
              ? `Offrir ${flowerCount} ${flowerCount > 1 ? 'fleurs' : 'fleur'} ?`
              : 'Solde insuffisant'}
          </h3>

          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => {
                try {
                  console.log('Current flower count:', flowerCount);
                  const newCount = Math.max(1, flowerCount - 1);
                  console.log('New flower count:', newCount);
                  if (typeof onFlowerCountChange !== 'function') {
                    console.error('onFlowerCountChange is not a function:', onFlowerCountChange);
                    return;
                  }
                  onFlowerCountChange(newCount);
                } catch (error) {
                  console.error('Error updating flower count:', error);
                }
              }}
              className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200"
              disabled={flowerCount <= 1}
            >
              -
            </button>
            <span className="text-xl font-semibold text-gray-900">{flowerCount}</span>
            <button
              onClick={() => {
                try {
                  console.log('Current flower count:', flowerCount);
                  const newCount = Math.min(10, flowerCount + 1);
                  console.log('New flower count:', newCount);
                  if (typeof onFlowerCountChange !== 'function') {
                    console.error('onFlowerCountChange is not a function:', onFlowerCountChange);
                    return;
                  }
                  onFlowerCountChange(newCount);
                } catch (error) {
                  console.error('Error updating flower count:', error);
                }
              }}
              className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200"
            >
              +
            </button>
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Coût : <span className="font-semibold text-red-600">{cost.toFixed(2)}€</span>
            </p>
            <p className="text-gray-600">
              Votre solde : <span className={`font-semibold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                {userBalance.toFixed(2)}€
              </span>
            </p>
          </div>

          {hasEnoughBalance ? (
            <div className="flex gap-3 w-full">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
              >
                Confirmer
              </button>
            </div>
          ) : (
            <div className="space-y-3 w-full">
              <button
                onClick={onCancel}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              {onBuyFlowers && (
                <button
                  onClick={onBuyFlowers}
                  className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                >
                  Acheter des fleurs
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}