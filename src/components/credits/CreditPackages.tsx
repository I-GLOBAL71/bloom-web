import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';
import { useCreditStore, CreditPackage } from './store/creditStore';

export function CreditPackages() {
  const { packages } = useCreditStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Choisissez votre formule</h2>
      
      <div className="grid md:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </div>
  );
}

function PackageCard({ package: pkg }: { package: CreditPackage }) {
  return (
    <motion.div
      className={`
        relative p-6 bg-white rounded-2xl shadow-lg border-2
        ${pkg.popular ? 'border-pink-500' : 'border-transparent'}
      `}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-amber-400 to-pink-500 text-white text-sm rounded-full">
            Populaire
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {pkg.id === 'garden' ? (
            <Crown className="w-12 h-12 text-amber-400" />
          ) : (
            <Star className="w-12 h-12 text-pink-500" />
          )}
        </div>
        <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
        <p className="text-gray-600 text-sm">{pkg.description}</p>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold">
          {pkg.price === 0 ? (
            'Gratuit'
          ) : (
            <>
              {pkg.price}€
              <span className="text-sm text-gray-500">/mois</span>
            </>
          )}
        </div>
        <div className="text-pink-500 font-medium mt-2">
          {pkg.petals} pétales
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {pkg.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      <motion.button
        className={`
          w-full py-3 rounded-xl font-medium
          ${pkg.popular
            ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white'
            : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Choisir
      </motion.button>
    </motion.div>
  );
}