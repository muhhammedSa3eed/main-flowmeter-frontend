import { Location } from '@/lib/types';

export async function getLocations(): Promise<Location[]> {
  const res = await fetch(
    `http://localhost:3000/api/location?area=&capacity=&hours=&fromdate=&todate=`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch locations: ${res.statusText}`);
  }

  return res.json();
}
