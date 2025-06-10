import React from 'react';
import { RoseIcon } from './RoseIcon';

const IconDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Différentes tailles :</h2>
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <RoseIcon size={24} />
            <span className="text-sm mt-2">Petite (24px)</span>
          </div>
          <div className="flex flex-col items-center">
            <RoseIcon size={32} />
            <span className="text-sm mt-2">Moyenne (32px)</span>
          </div>
          <div className="flex flex-col items-center">
            <RoseIcon size={48} />
            <span className="text-sm mt-2">Grande (48px)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Exemples d'utilisation :</h2>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            <RoseIcon size={20} />
            <span>Avec un bouton</span>
          </button>
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
            <RoseIcon size={20} />
            <span>Dans un badge</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconDemo;