import React, { Suspense } from 'react';

import { RFP } from '@/types';
// ← point at the file where you now export “RfpDataTable”
import Loading from '@/app/loading';
import { Webhook } from 'lucide-react';
import { columns } from './columns';
import RFpDataTable from './RfpTable';
import { cookies } from 'next/headers';
import { fetchPreferences } from '@/lib/fetchPreferences';
// import { getCookies } from 'next-client-cookies/server';
async function getRFP(): Promise<RFP[]> {
  const token = (await cookies()).get('token')?.value ?? '';
  // console.log({ token });
  // const cookieStore = cookies();
  // const cookies = getCookies();
  // console.log({ cookieStore });
  // const cookieHeader = (await cookieStore)
  //   .getAll()
  //   .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
  //   .join('; ');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/full`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    console.error('RFP fetch failed:', response.status, response.statusText);
    throw new Error('Failed to fetch Rfp');
  }

  const rfp = await response.json();
  console.log('RFP Data :', rfp);
  return rfp;
}
const tableName = 'RFpDataTable';

export default async function RfpCompliancePage() {
  const RFpData = await getRFP();
  const preferences = await fetchPreferences(tableName);
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <Webhook />
            <div className="text-xl font-bold">Flow Meters</div>
          </div>
          <RFpDataTable
            data={RFpData}
            columns={columns}
            preferences={preferences}
          />
        </div>
      </div>
    </Suspense>
  );
}
