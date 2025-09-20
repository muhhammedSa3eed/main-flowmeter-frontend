import React, { Suspense } from "react";
import { RFP } from "@/types";
import Loading from "@/app/loading";
import { SquareMenu } from "lucide-react";

import { cookies } from "next/headers";
import RfpReports from "@/components/RfpReports";
async function getRFP(): Promise<RFP[]> {
  const cookieStore = cookies();

  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join("; ");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/full`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    console.error("RFP fetch failed:", response.status, response.statusText);
    throw new Error("Failed to fetch Rfp");
  }

  const rfp = await response.json();
  console.log("RFP Data :", rfp);
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
