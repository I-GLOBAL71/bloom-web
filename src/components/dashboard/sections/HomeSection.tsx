import React from 'react';
import { Outlet } from 'react-router-dom';

export default function HomeSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Home</h1>
      <Outlet />
    </div>
  );
}
