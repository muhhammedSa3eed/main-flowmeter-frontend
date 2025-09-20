import React, { Suspense } from "react";
import Loading from "@/app/loading";
import Reports from "@/components/Reports";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ReportId: number }>;
}) {
  const ReportId = (await params).ReportId;
    console.log("Report ID:",ReportId)
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col">
        <div className="flex justify-center items-center min-h-96 pb-5">
          <Reports  ReportId={ReportId} />
        </div>
      </div>
    </Suspense>
  );
}
