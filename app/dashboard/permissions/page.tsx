import { Suspense } from 'react';
import Loading from '@/app/loading';
import { ShieldCheck } from 'lucide-react';
import PermissionsTable from './PermissionsTable';
import { cookies } from 'next/headers';
import { columns } from './columns';
import { TablePermission } from '@/types';
import { fetchPreferences } from '@/lib/fetchPreferences';
async function getAllGroup(): Promise<TablePermission[]> {
  // const cookieStore = cookies();

  // const cookieHeader = (await cookieStore)
  //   .getAll()
  //   .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
  //   .join("; ");
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/permissions/table`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    }
  );

  // if (!response.ok) {
  //   throw new Error('Failed to fetch Groups');
  // }

  const UsersData = await response.json();
  return UsersData?.tablePermissions;
}
const tableName = 'Permissions';

export default async function Page() {
  const GroupsData = await getAllGroup();
  const preferences = await fetchPreferences(tableName);
  console.log('Groups :', GroupsData);
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-4 md:p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <div>
              <ShieldCheck />
            </div>
            <div className="text-xl font-bold  gap-2">Permissions </div>
          </div>
          <PermissionsTable
            data={GroupsData}
            columns={columns}
            preferences={preferences}
          />
        </div>
      </div>
    </Suspense>
  );
}
