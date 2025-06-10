import React, { useEffect } from 'react';
import { setSuperAdmin, checkUserRole } from '../../lib/firebase/auth';

export const SetupSuperAdmin: React.FC = () => {
  useEffect(() => {
    const setupAdmin = async () => {
      try {
        await setSuperAdmin('fabricewilliam73@gmail.com');
        const role = await checkUserRole('fabricewilliam73@gmail.com');
        console.log('Super admin setup complete:', role);
      } catch (error) {
        console.error('Failed to setup super admin:', error);
      }
    };

    setupAdmin();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Configuration Super Admin</h2>
      <p>Configuration du rôle super-admin en cours...</p>
      <p>Veuillez vérifier la console pour les détails.</p>
    </div>
  );
};