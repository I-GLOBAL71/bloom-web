import React from 'react';
import '/node_modules/flag-icons/css/flag-icons.min.css';

interface CountryFlagProps {
  country: string;
  className?: string;
}

export function CountryFlag({ country, className = '' }: CountryFlagProps) {
  // Convert country code to lowercase for flag-icons
  const countryCode = country.toLowerCase();
  
  return (
    <span 
      className={`fi fi-${countryCode} ${className}`}
      style={{ fontSize: '1.5em', marginRight: '0.5rem' }}
    />
  );
}
