import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { MatchResult } from '../types';

interface MatchAnimationProps {
  matchResult: MatchResult;
  onComplete: () => void;
}

export function MatchAnimation({ matchResult, onComplete }: MatchAnimationProps) {
  return (
    <AnimatePresence>
      {matchResult && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <motion.div
              className="mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="relative inline-block">
                <Heart className="w-20 h-20 text-pink-500" />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-20 h-20 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold mb-4">C'est un match !</h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">
                Vous avez {matchResult.score.total}% de compatibilité
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {matchResult.matchedOn.map((criteria) => (
                  <span
                    key={criteria}
                    className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm"
                  >
                    {criteria}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={onComplete}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-xl font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Commencer à discuter
              </motion.button>
              <motion.button
                onClick={onComplete}
                className="w-full px-6 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continuer à swiper
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}