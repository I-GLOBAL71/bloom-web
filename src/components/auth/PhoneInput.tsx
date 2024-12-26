import React from 'react';
import { Phone } from 'lucide-react';
import PhoneInput, { Country, Props as PhoneInputProps } from 'react-phone-number-input';
import { CountryFlag } from './CountryFlag';
import 'react-phone-number-input/style.css';
import '../../styles/phone-input.css';

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

type CountrySelectComponentProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

const CountrySelect: React.FC<CountrySelectComponentProps> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
  >
    {options.map((option) => (
      <option key={`country-${option.value}`} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export function CustomPhoneInput({ value, onChange }: CustomPhoneInputProps) {
  return (
    <div className="relative">
      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
      <PhoneInput
        international
        defaultCountry="FR"
        value={value}
        onChange={onChange}
        className="w-full"
        countrySelectComponent={CountrySelect}
        flagComponent={({ country }) => <CountryFlag country={country as string} />}
      />
    </div>
  );
}