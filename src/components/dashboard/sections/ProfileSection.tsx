import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProfileSectionProps {
  children?: React.ReactNode;
}

export default function ProfileSection({ children }: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      {children || <Outlet />}
    </div>
  );
}
