import React, { Suspense } from 'react';
import Loading from '@/app/loading';
import MultiStepCampaign from '@/components/(campaign)/_components/multi-step-campaign';
import { cookies } from "next/headers";
export default async function FlowMeterFormPage({
  params,
}: {
  params: Promise<{ RfpId: number }>;
}) {
  const RfpId = (await params).RfpId;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  // console.log({ theme });

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <MultiStepCampaign RfpId={RfpId} token={token} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
