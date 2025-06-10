import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe2, Loader } from 'lucide-react';
import { signInWithGoogle } from '../../lib/auth';
import { AuthMethodButton } from './AuthMethodButton';
import { EmailForm } from './EmailForm';
import { PhoneForm } from './PhoneForm';

interface AuthMethodsProps {
  onSuccess: () => void;
}

export function AuthMethods({ onSuccess }: AuthMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'phone' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setError('Erreur lors de la connexion avec Google');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <AuthMethodButton
          icon={<Mail />}
          label="Email"
          selected={selectedMethod === 'email'}
          onClick={() => setSelectedMethod('email')}
        />
        <AuthMethodButton
          icon={<Phone />}
          label="Téléphone"
          selected={selectedMethod === 'phone'}
          onClick={() => setSelectedMethod('phone')}
        />
        <AuthMethodButton
          icon={<Globe2 />}
          label="Google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
        </AuthMethodButton>
      </div>

      {selectedMethod === 'email' && (
        <EmailForm onSuccess={onSuccess} />
      )}

      {selectedMethod === 'phone' && (
        <PhoneForm onSuccess={onSuccess} />
      )}
    </div>
  );
}