import { create } from 'zustand';
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';

interface AdminAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ 
        user: userCredential.user,
        isAuthenticated: true,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({ 
        user: null,
        isAuthenticated: false 
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  setError: (error) => set({ error })
}));

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
  useAdminAuthStore.setState({ 
    user,
    isAuthenticated: !!user,
    loading: false 
  });
});