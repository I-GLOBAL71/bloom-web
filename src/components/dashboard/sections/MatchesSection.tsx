import React from 'react';
import { Outlet } from 'react-router-dom';

export function MatchesSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Matches</h1>
      <Outlet />
    </div>
  );
}
