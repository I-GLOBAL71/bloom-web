import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserList } from './UserList';
import { UserStats } from './UserStats';
import { useUserStore } from '../../store/userStore';
import { subscribeToUsers } from '../../store/userStore';

export function UserManagement() {
  const { loading, error } = useUserStore();

  useEffect(() => {
    const unsubscribe = subscribeToUsers();
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Une erreur est survenue: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
      <UserStats />
      <UserList />
    </div>
  );
}