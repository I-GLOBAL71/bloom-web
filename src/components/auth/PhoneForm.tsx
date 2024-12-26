import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { signInWithPhone } from '../../lib/auth';
import { CustomPhoneInput } from './PhoneInput';

interface PhoneFormProps {
  onSuccess: () => void;
}

export function PhoneForm({ onSuccess }: PhoneFormProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithPhone(phone, 'phone-sign-in-button');
      setError('');
      // Handle verification code step
    } catch (err) {
      setError("Erreur lors de l'envoi du code");
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
      <CustomPhoneInput value={phone} onChange={setPhone} />
      <motion.button
        type="submit"
        id="phone-sign-in-button"
        disabled={loading || !phone}
        className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Recevoir le code'}
      </motion.button>
    </motion.form>
  );
}