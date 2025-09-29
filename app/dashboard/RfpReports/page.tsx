import React, { Suspense } from 'react';
// import { RFP } from '@/types';
import Loading from '@/app/loading';
import { SquareMenu } from 'lucide-react';
// import RfpReports from '@/components/RfpReports';
// import { cookies } from 'next/headers';
import ReportsDataTable from './reportsData-table';
import { columns } from './columns';

// async function getRFP(): Promise<RFP[]> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('token')?.value || '';
//   // const token = (await cookies()).get('token')?.value ?? '';
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/full`,
//     {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: 'include',
//     }
//   );
//   if (!response.ok) {
//     console.error('RFP fetch failed:', response.status, response.statusText);
//     throw new Error('Failed to fetch Rfp');
//   }

//   const rfp = await response.json();
//   console.log('RFP Data :', rfp);
//   return rfp;
// }
const reportData = [
  {
    reportId: 'REP-001',
    reportName: 'Monthly Performance Report - January',
    reportType: 'Monthly',
    createdAt: '2025-01-31T10:00:00.000Z',
    author: 'Mohamed Ahmed',
    status: 'Completed',
  },
  {
    reportId: 'REP-002',
    reportName: 'Financial Review Report - Q1',
    reportType: 'Financial',
    createdAt: '2025-03-15T09:30:00.000Z',
    author: 'Sara Ali',
    status: 'Under Review',
  },
  {
    reportId: 'REP-003',
    reportName: 'Regular Maintenance Report',
    reportType: 'Technical',
    createdAt: '2025-02-20T14:45:00.000Z',
    author: 'Ahmed Youssef',
    status: 'In Progress',
  },
  {
    reportId: 'REP-004',
    reportName: 'February Sales Report',
    reportType: 'Commercial',
    createdAt: '2025-03-05T11:20:00.000Z',
    author: 'Mona Khaled',
    status: 'Completed',
  },
  {
    reportId: 'REP-005',
    reportName: 'Wastewater Treatment Project Report',
    reportType: 'Technical',
    createdAt: '2025-04-10T08:15:00.000Z',
    author: 'Khaled Hassan',
    status: 'Under Review',
  },
];

export default async function ReportsPage() {
  //   const RFpData = await getRFP();
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex items-center justify-center gap-2 text-custom-green2 mb-3">
            <SquareMenu className="w-6 h-6" />
            <span className="text-xl font-bold">Flow Meters Reports</span>
          </div>
          
          <ReportsDataTable data={reportData} columns={columns}/>
          {/* <RfpReports RFpData={RFpData} /> */}
        </div>
      </div>
    </Suspense>
  );
}
