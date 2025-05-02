// components/AddressAutocomplete.tsx
'use client';

import { useRef, useCallback } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'] as const;

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelect: (address: string) => void;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
}: AddressAutocompleteProps) {
  const autoRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: [...libraries],
  });

  const handleLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocomplete.setFields(['formatted_address']);
    autoRef.current = autocomplete;
  }, []);

  const handlePlaceChanged = useCallback(() => {
    const ac = autoRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    if (place.formatted_address) {
      onSelect(place.formatted_address);
      onChange(place.formatted_address);
    }
  }, [onChange, onSelect]);

  if (loadError) return <p className="text-red-600">Error loading Maps API</p>;
  if (!isLoaded) return <p>Loading autocomplete…</p>;

  return (
    <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handlePlaceChanged}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search address"
        className="w-full border px-3 py-2 rounded"
      />
    </Autocomplete>
  );
}
