import React, { Suspense } from 'react';
import { RFP } from '@/types';
import Loading from '@/app/loading';
import { SquareMenu } from 'lucide-react';
import RfpReports from '@/components/RfpReports';
import { cookies } from 'next/headers';
async function getRFP(): Promise<RFP[]> {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join('; ');
  console.log({ cookieHeader });
  // const token = (await cookies()).get('token')?.value ?? '';
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/full`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YmExMDEzLTIyNTUtNDdkYi1iOTllLWViNmI3M2Q3ZDI0ZiIsImVtYWlsIjoid2FsYWFlbWFtMDc3QGdtYWlsLmNvbSIsImdyb3VwIjoiU3VwZXJBZG1pbiIsImlhdCI6MTc1ODQ1ODU3OCwiZXhwIjoxNzU4NDU5NDc4fQ.7oM7q_brutuxGdUo0OowsnvBMeMyMp8HxkevLHxno5s',
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

export default async function RfpCompliancePage() {
  const RFpData = await getRFP();
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex items-center justify-center gap-2 text-custom-green2 mb-3">
            <SquareMenu className="w-6 h-6" />
            <span className="text-xl font-bold">Flow Meters Reports</span>
          </div>
          <RfpReports RFpData={RFpData} />
        </div>
      </div>
    </Suspense>
  );
}
