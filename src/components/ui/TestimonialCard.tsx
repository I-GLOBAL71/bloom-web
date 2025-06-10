import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../animations/variants';

interface TestimonialCardProps {
  name: string;
  age: number;
  text: string;
  image: string;
}

export function TestimonialCard({ name, age, text, image }: TestimonialCardProps) {
  return (
    <motion.div 
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
      variants={scaleIn}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.img 
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-600">{age} ans</p>
        </div>
      </div>
      <p className="text-gray-700 italic">{text}</p>
      <div className="mt-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            className="w-5 h-5 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>
    </motion.div>
  );
}