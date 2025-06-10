import { EventLocation } from '../types';

interface LocationInputProps {
  value: EventLocation;
  onChange: (location: EventLocation) => void;
}

export const LocationInput = ({ value, onChange }: LocationInputProps) => (
  <input
    type="text"
    placeholder="Location"
    value={value.address}
    onChange={(e) => onChange({
      address: e.target.value,
      city: 'Test City',
      country: 'Test Country',
      latitude: 0,
      longitude: 0
    })}
  />
);