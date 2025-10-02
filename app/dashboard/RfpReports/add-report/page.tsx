/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@/app/loading';
import AddReportForm from '@/components/reports/add-report-form';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

async function getAllFlowMeter(): Promise<any[]> {
  // const cookieStore = await cookies();
  // const token = cookieStore.get('token')?.value || '';
  // const token = (await cookies()).get('token')?.value ?? '';
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rfps`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
    },
    // credentials: 'include',
  });
  if (!response.ok) {
    console.error('RFP fetch failed:', response.status, response.statusText);
    throw new Error('Failed to fetch Rfp');
  }

  const flowData = await response.json();
  console.log('RFP Data :', flowData);
  return flowData?.data;
}
export default async function AddReportsPage() {
  const flowMeterData = await getAllFlowMeter();
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-6">
          {/* <div className="flex items-center justify-center gap-2 text-custom-green2 mb-3">
            <h2 className="text-xl font-bold">Add Report</h2>
          </div> */}
          <AddReportForm flowMeterData={flowMeterData} token={token}/>
          {/* <RfpReports RFpData={RFpData} /> */}
        </div>
      </div>
    </Suspense>
  );
}
