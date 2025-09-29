import React, { Suspense } from 'react';
import Loading from '@/app/loading';
import { Unplug } from 'lucide-react';
import EditConnections from '@/components/CRUD/Connections/EditConnections';
import { dataPolling, dataType } from '@/lib/ConnectionsData';
import { cookies } from 'next/headers';
import { DeviceDB } from '@/types';
async function getDeviceById(deviceId: string): Promise<DeviceDB> {
  // const cookieStore = cookies();

  // const cookieHeader = (await cookieStore)
  //   .getAll()
  //   .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
  //   .join("; ");
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/${deviceId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch device');

  return await response.json();
}
export default async function Page({
  params,
}: {
  params: Promise<{ deviceId: string }>;
}) {
  const device = await getDeviceById((await params).deviceId);
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <Unplug />
            <div className="text-xl font-bold">Edit Connections</div>
          </div>
          <EditConnections
            selectType={dataType}
            selectPolling={dataPolling}
            device={device}
          />
        </div>
      </div>
    </Suspense>
  );
}
