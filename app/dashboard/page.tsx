// import SectionCards from "@/components/SideBar/section-cards";

// export default function Page() {
//   return (
//     <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//       <SectionCards />
//     </div>
//   );
// }
import MapWrapper from '@/components/map/MapWrapper';
import { getLocations } from '../actions/getLocations';
import { DashboardStats } from '@/types';
import { cookies } from 'next/headers';
import SectionCards from '@/components/SideBar/section-cards';
async function getDashboardData(): Promise<DashboardStats> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  console.log({ token });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/dashboard`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // if (!response.ok) throw new Error('Failed to fetch devices');

  return await response.json();
}
export default async function Page() {
  const locations = await getLocations();
  const dashboard = await getDashboardData();

  return (
    <div>
      <div className="md:h-[240px] lg:h-[150px] w-full py-3 ">
        <SectionCards dashboard={dashboard} />
      </div>
      <MapWrapper locations={locations} />
    </div>
  );
}
