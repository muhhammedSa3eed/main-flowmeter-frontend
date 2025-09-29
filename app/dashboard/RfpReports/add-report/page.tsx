import Loading from '@/app/loading';
import AddReportForm from '@/components/reports/add-report-form';
import { Suspense } from 'react';

export default async function AddReportsPage() {
  //   const RFpData = await getRFP();
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-6">
          {/* <div className="flex items-center justify-center gap-2 text-custom-green2 mb-3">
            <h2 className="text-xl font-bold">Add Report</h2>
          </div> */}
          <AddReportForm />
          {/* <RfpReports RFpData={RFpData} /> */}
        </div>
      </div>
    </Suspense>
  );
}
