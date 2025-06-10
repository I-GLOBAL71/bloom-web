<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthMethod, AuthError } from '../../types/auth';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export interface AuthFormProps {
  initialMethod?: AuthMethod;
}

export const AuthForm: React.FC<AuthFormProps> = ({ initialMethod = 'email' }): JSX.Element => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    isAuthenticated,
    isLoading,
    error,
    signInWithEmail,
    signInWithPhone,
    verifyPhoneCode,
    completeEmailSignIn,
    user
  } = useAuth();

  // Local states
  const [method, setMethod] = useState<AuthMethod>(initialMethod);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('33'); // Default to France
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Detect if device supports silent phone auth
  const [supportsSilentAuth, setSupportsSilentAuth] = useState(false);
  useEffect(() => {
    const checkSilentAuthSupport = () => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const hasServiceWorker = 'serviceWorker' in navigator;
      setSupportsSilentAuth(isAndroid && hasServiceWorker);
    };
    checkSilentAuthSupport();
  }, []);

  // Handle redirect cleanup
  useEffect(() => {
    console.log('[AuthForm] Auth state:', {
      isAuthenticated,
      user,
      hasCompletedOnboarding: user?.hasCompletedOnboarding
    });

    sessionStorage.removeItem('auth_redirect_started');
    sessionStorage.removeItem('auth_redirect_time');

    if (isAuthenticated && user) {
      console.log('[AuthForm] User authenticated:', {
        userId: user.id,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      });

      if (!user.hasCompletedOnboarding) {
        console.log('[AuthForm] Redirecting to onboarding...');
        navigate('/onboarding');
      } else {
        console.log('[AuthForm] Redirecting to dashboard...');
        navigate('/app/dashboard');
      }
    }
  }, [isAuthenticated, navigate, user]);

  // Log auth steps
  useEffect(() => {
    if (error) {
      console.error('[AuthForm] Auth error:', error);
    }
    if (isLoading) {
      console.log('[AuthForm] Auth loading...');
    }
  }, [error, isLoading]);

  // Reset errors on method change
  useEffect(() => {
    setLocalError(null);
    setIsVerificationStep(false);
  }, [method]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{6,14}$/;
    return phoneRegex.test(phone);
  };

  const validateCode = (code: string): boolean => {
    return code.length >= 4 && code.length <= 8;
  };

  // Event handlers
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLocalError(null);
      if (!validateEmail(email)) {
        setLocalError('Adresse email invalide');
        return;
      }
      await signInWithEmail(email);
      setEmailSent(true);
      setIsVerificationStep(true);
    } catch (error) {
      setLocalError((error as AuthError).message);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLocalError(null);
      if (!validatePhone(phoneNumber)) {
        setLocalError('Numéro de téléphone invalide');
        return;
      }
      const fullNumber = `+${countryCode}${phoneNumber}`;
      if (supportsSilentAuth) {
        try {
          const vid = await signInWithPhone(fullNumber);
          setVerificationId(vid);
          await verifyPhoneCode('', vid);
          return;
        } catch (silentErr) {
          console.log('Silent auth failed, falling back to SMS');
        }
      }
      const vid = await signInWithPhone(fullNumber);
      setVerificationId(vid);
      setIsVerificationStep(true);
    } catch (error) {
      setLocalError((error as AuthError).message);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLocalError(null);
      if (!validateCode(verificationCode)) {
        setLocalError('Code de vérification invalide');
        return;
      }

      if (method === 'phone') {
        await verifyPhoneCode(verificationCode, verificationId);
      } else if (method === 'email') {
        await completeEmailSignIn(email, verificationCode);
      }
    } catch (error) {
      setLocalError((error as AuthError).message);
    }
  };

  const displayError = localError || (error?.message ?? null);

  return (
    <div className="w-full space-y-4">
      {displayError && (
        <div className="rounded-md bg-red-50 p-4 transform transition-all duration-200 ease-in-out">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          </div>
        </div>
      )}

      <form 
        ref={formRef}
        className="space-y-4"
        onSubmit={
          isVerificationStep ? handleVerification :
          method === 'email' ? handleEmailSignIn :
          method === 'phone' ? handlePhoneSignIn :
          (e: React.FormEvent) => e.preventDefault()
        }
      >
        <div className="space-y-4">
          {!isVerificationStep && method === 'email' && (
            <div className="transform transition-all duration-200">
              <label htmlFor="email" className="sr-only">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-rose-300"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {!isVerificationStep && method === 'phone' && (
            <div className="transform transition-all duration-200">
              <label htmlFor="phone" className="sr-only">Numéro de téléphone</label>
              <PhoneInput
                country={'fr'}
                value={phoneNumber}
                onChange={(value: string, country: CountryData) => {
                  setPhoneNumber(value);
                  setCountryCode(country.dialCode || '33');
                  setLocalError('');
                }}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white'
                }}
                buttonStyle={{
                  borderRadius: '6px 0 0 6px',
                  border: '1px solid #E5E7EB',
                  borderRight: 'none',
                  backgroundColor: 'white'
                }}
                containerStyle={{
                  width: '100%',
                  position: 'relative'
                }}
                dropdownStyle={{
                  width: '300px',
                  maxHeight: '300px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  position: 'absolute',
                  top: 'auto',
                  bottom: '100%',
                  marginBottom: '8px',
                  zIndex: 50
                }}
                searchStyle={{
                  width: '100%',
                  height: '36px',
                  padding: '8px',
                  margin: '4px 0',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB'
                }}
                placeholder="Numéro de téléphone"
              />
            </div>
          )}

          {isVerificationStep && method === 'email' && emailSent && (
            <div className="mb-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-rose-800 mb-1">Lien de connexion envoyé !</h3>
                  <p className="text-sm text-rose-600 mb-2">
                    Un lien magique a été envoyé à <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-xs text-rose-500">
                    Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVerificationStep && method === 'phone' && (
            <div className="transform transition-all duration-200">
              <label htmlFor="code" className="sr-only">Code de vérification</label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-rose-300"
                placeholder="Code de vérification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          )}
        </div>

        {method === 'phone' && <div id="recaptcha-container" className="hidden"></div>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 ${
            isLoading 
              ? 'bg-rose-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            isVerificationStep && method === 'phone' ? 'Vérifier' :
            isVerificationStep && method === 'email' ? 'Vérifier votre email' :
            'Continuer'
          )}
        </button>
      </form>
    </div>
  );
};
=======
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
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
