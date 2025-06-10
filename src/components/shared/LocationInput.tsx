import React, { useState, useRef, useEffect } from 'react';
import { Location } from '@/types';
import debounce from 'lodash/debounce';

interface LocationInputProps {
  initialAddress?: string;
  onLocationSelect: (location: Location) => void;
}

interface NominatimLocation {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    country: string;
  };
  lat: string;
  lon: string;
}

export function LocationInput({ initialAddress = '', onLocationSelect }: LocationInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<NominatimLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            'Accept-Language': 'fr',
          },
        }
      );
      const data: NominatimLocation[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useRef(
    debounce((query: string) => {
      fetchSuggestions(query);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetch(value);
  };

  const handleSelectSuggestion = (suggestion: NominatimLocation) => {
    const address = suggestion.address;
    const formattedAddress = [
      address.house_number,
      address.road,
      address.city || address.town
    ].filter(Boolean).join(', ');

    setSearchTerm(formattedAddress);
    setSuggestions([]);

    onLocationSelect({
      address: formattedAddress,
      city: address.city || address.town || '',
      coordinates: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon)
      }
    });
  };

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Entrez une adresse"
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
        autoComplete="off"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-400"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-pink-50 focus:bg-pink-50 focus:outline-none transition-colors"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}