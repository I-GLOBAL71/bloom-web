import { create } from 'zustand';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'banned';
  joinDate: string;
  lastActive: string;
  matches: number;
  credits: number;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

// Subscribe to users collection
export function subscribeToUsers() {
  const { setUsers, setLoading, setError } = useUserStore.getState();
  
  setLoading(true);
  
  const q = query(collection(db, 'users'));
  
  return onSnapshot(q, 
    (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      setUsers(users);
      setLoading(false);
    },
    (error) => {
      console.error('Error fetching users:', error);
      setError(error.message);
      setLoading(false);
    }
  );
}