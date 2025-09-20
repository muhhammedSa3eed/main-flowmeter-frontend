import React, { Suspense } from "react";
import Loading from "@/app/loading";
import MultiStepCampaign from "@/components/(campaign)/_components/multi-step-campaign";

export default async function EditFlowMeterFormPage({
  params,
}: {
  params: Promise<{ RfpId: number }>;
}) {
  const RfpId = (await params).RfpId;
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col">
        <div className="flex justify-center items-center min-h-96 pb-5">
          <MultiStepCampaign  RfpId={RfpId} />
        </div>
      </div>
    </Suspense>
  );
}
