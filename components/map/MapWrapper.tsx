// app/map/MapWrapper.tsx
'use client';

// import Map from '@/app/map/Map cluster test';
import { Suspense } from 'react';
import Map from './Map';
import { Location } from '@/lib/types';


interface locationProps {
  locations: Location[];
  
}
export default function MapWrapper({ locations }: locationProps) {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <Map locations={locations}  />
    </Suspense>
  );
}
