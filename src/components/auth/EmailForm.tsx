import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader } from 'lucide-react';
import { sendMagicLink } from '../../lib/auth';

interface EmailFormProps {
  onSuccess: () => void;
}

export function EmailForm({ onSuccess }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendMagicLink(email);
      setError('');
      // Show success message or handle next steps
    } catch (err) {
      setError("Erreur lors de l'envoi du lien magique");
    }
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
    >
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="w-full pl-12 pr-4 py-4 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 transition-colors"
          required
        />
      </div>
      <motion.button
        type="submit"
        disabled={loading || !email}
        className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Recevoir le lien magique'}
      </motion.button>
    </motion.form>
  );
}