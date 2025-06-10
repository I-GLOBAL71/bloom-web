import React from 'react';
import * as Gi from 'react-icons/gi';
import * as Fa from 'react-icons/fa';
import * as Io from 'react-icons/io5';
import * as Bs from 'react-icons/bs';
import * as Pi from 'react-icons/pi';
import * as Md from 'react-icons/md';
import * as Hi from 'react-icons/hi';
import * as Ri from 'react-icons/ri';

const FlowerIconsPreview = () => {
  // Collection des icônes de fleurs
  const flowerIcons = [
    // Game Icons (Gi)
    { icon: Gi.GiFlowerStar, name: 'GiFlowerStar', lib: 'Game Icons' },
    { icon: Gi.GiFlowerTwirl, name: 'GiFlowerTwirl', lib: 'Game Icons' },
    { icon: Gi.GiFlowerPot, name: 'GiFlowerPot', lib: 'Game Icons' },
    { icon: Gi.GiFlowers, name: 'GiFlowers', lib: 'Game Icons' },
    { icon: Gi.GiFlowerEmblem, name: 'GiFlowerEmblem', lib: 'Game Icons' },
    { icon: Gi.GiRose, name: 'GiRose', lib: 'Game Icons' }
  ];

  // Collection des icônes de pétales
  const petalIcons = [
    // Game Icons
    { icon: Gi.GiLotusFlower, name: 'GiLotusFlower', lib: 'Game Icons' },
    // Font Awesome
    { icon: Fa.FaLeaf, name: 'FaLeaf', lib: 'Font Awesome' },
    { icon: Fa.FaSeedling, name: 'FaSeedling', lib: 'Font Awesome' },
    // Material Design
    { icon: Md.MdLocalFlorist, name: 'MdLocalFlorist', lib: 'Material Design' },
    // Heroicons
    { icon: Hi.HiSparkles, name: 'HiSparkles', lib: 'Heroicons' },
    // Remix Icons
    { icon: Ri.RiLeafLine, name: 'RiLeafLine', lib: 'Remix Icons' },
    { icon: Ri.RiLeafFill, name: 'RiLeafFill', lib: 'Remix Icons' },
    // Phosphor Icons
    { icon: Pi.PiLeafFill, name: 'PiLeafFill', lib: 'Phosphor' },
    { icon: Pi.PiLeafLight, name: 'PiLeafLight', lib: 'Phosphor' }
  ];

  return (
    <div className="p-6 space-y-12">
      {/* Section Fleurs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-red-700">Icônes de Fleurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupBy(flowerIcons, 'lib')).map(([lib, icons]) => (
            <div key={lib} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">{lib}</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {(icons as typeof flowerIcons).map(({ icon: Icon, name }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-2 mb-2">
                      <Icon className="text-red-700 w-8 h-8" />
                      <Icon className="text-red-600 w-6 h-6" />
                      <Icon className="text-red-500 w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 text-center">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Pétales */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-pink-600">Icônes de Pétales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupBy(petalIcons, 'lib')).map(([lib, icons]) => (
            <div key={lib} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">{lib}</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {(icons as typeof petalIcons).map(({ icon: Icon, name }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-2 mb-2">
                      <Icon className="text-pink-600 w-8 h-8" />
                      <Icon className="text-pink-500 w-6 h-6" />
                      <Icon className="text-pink-400 w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 text-center">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Variantes de Couleurs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Variantes de couleurs pour les pétales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { color: 'pink-600', label: 'Rose foncé' },
            { color: 'pink-500', label: 'Rose vif' },
            { color: 'pink-400', label: 'Rose clair' },
            { color: 'rose-500', label: 'Rose intense' },
            { color: 'fuchsia-500', label: 'Fuchsia' },
            { color: 'purple-500', label: 'Violet' }
          ].map(({ color, label }) => (
            <div key={color} className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
              <Fa.FaLeaf className={`w-8 h-8 text-${color}`} />
              <span className="text-xs text-gray-600 mt-2">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Utilitaire pour grouper les icônes par bibliothèque
const groupBy = <T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = item[key];
    result[group] = [...(result[group] || []), item];
    return result;
  }, {} as Record<string, T[]>);
};

export default FlowerIconsPreview;