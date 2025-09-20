import MapWrapper from '@/components/map/MapWrapper';
import { getLocations } from '../actions/getLocations';
import { DashboardStats } from '@/types';
import { cookies } from 'next/headers';
async function getDashboardData(): Promise<DashboardStats> {
  const cookieStore = cookies();

  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join('; ');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/dashboard`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch devices');

  return await response.json();
}
export default async function Page() {
  const locations = await getLocations();
  const dashboard = await getDashboardData();
  console.log({ dashboard });
  return <MapWrapper locations={locations}  dashboard={dashboard}/>;
}
