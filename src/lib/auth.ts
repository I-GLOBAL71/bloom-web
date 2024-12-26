import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { auth } from './firebase';

// Google Authentication
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

// Email Magic Link Authentication
export const sendMagicLink = async (email: string) => {
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  } catch (error) {
    console.error('Magic Link Error:', error);
    throw error;
  }
};

// Phone Authentication
export const signInWithPhone = async (phoneNumber: string, recaptchaContainerId: string) => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible'
    });
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Phone Auth Error:', error);
    throw error;
  }
};