<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';

interface LocationStepProps {
  onNext: (data: { city: string; country: string }) => void;
  onBack?: () => void;
  initialCity?: string;
}

interface Location {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    country: string;
  };
}

export function LocationStep({ onNext, onBack, initialCity = '' }: LocationStepProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(initialCity);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
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
            'Accept-Language': 'fr', // Préférence pour les résultats en français
          },
        }
      );
      const data: Location[] = await response.json();
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
    setInputValue(value);
    debouncedFetch(value);
  };

  const handleSelectSuggestion = (location: Location) => {
    const cityName = location.address.city || location.address.town || '';
    setInputValue(cityName);
    setSelectedLocation(location);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation) {
      onNext({
        city: inputValue,
        country: selectedLocation.address.country
      });
=======
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { CityInput } from '../../auth/CityInput';

interface OnboardingStepProps {
  onNext: (value: any) => void;
  onBack: () => void;
  data?: string;
  isFirstStep?: boolean;
}

export function LocationStep({ onNext, onBack, data = '', isFirstStep }: OnboardingStepProps) {
  const [location, setLocation] = useState(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onNext(location.trim());
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
    }
  };

  return (
<<<<<<< HEAD
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {t('onboarding.steps.location.title')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t('onboarding.steps.location.placeholder')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
            autoComplete="off"
          />
          
          {isLoading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-400"></div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div
              ref={suggestionRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-rose-50 focus:bg-rose-50 focus:outline-none transition-colors"
                  onClick={() => handleSelectSuggestion(location)}
                >
                  {location.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-rose-600 hover:text-rose-700 transition-colors"
            >
              {t('onboarding.back')}
            </button>
          )}
          
          <motion.button
            type="submit"
            className={`px-6 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg shadow-md hover:from-rose-500 hover:to-rose-600 transition-colors ${
              !selectedLocation ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileTap={{ scale: 0.95 }}
            disabled={!selectedLocation}
          >
            {t('onboarding.continue')}
          </motion.button>
        </div>
      </form>
    </div>
=======
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Où êtes-vous situé(e) ?</h2>
        <p className="text-gray-600">Pour vous proposer des rencontres près de chez vous</p>
      </div>

      <CityInput 
        value={location}
        onChange={setLocation}
        onSelect={(location) => {
          setLocation(location.display_name);
        }}
      />

      <motion.button
        type="submit"
        className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
        disabled={!location.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continuer
      </motion.button>

      {!isFirstStep && (
        <motion.button
          type="button"
          onClick={onBack}
          className="w-full px-8 py-4 border-2 border-pink-500 text-pink-500 rounded-full text-lg hover:bg-pink-50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Retour
        </motion.button>
      )}
    </form>
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
  );
}