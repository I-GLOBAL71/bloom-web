import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Loader } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full pl-12 pr-4 py-4 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 transition-colors"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full pl-12 pr-4 py-4 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 transition-colors"
            required
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          mode === 'signup' ? 'Créer mon compte' : 'Se connecter'
        )}
      </motion.button>
    </form>
  );
}