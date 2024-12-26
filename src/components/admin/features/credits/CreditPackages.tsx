import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useCreditStore } from '../../../credits/store/creditStore';

export function CreditPackages() {
  const { packages } = useCreditStore();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Packages de Crédits</h2>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          Nouveau Package
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            className="border border-gray-200 rounded-lg p-4"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.petals} pétales</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="p-1 hover:bg-gray-100 rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </motion.button>
                <motion.button
                  className="p-1 hover:bg-gray-100 rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </motion.button>
              </div>
            </div>

            <div className="text-2xl font-bold mb-4">{pkg.price}€</div>

            <ul className="text-sm text-gray-600 space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}