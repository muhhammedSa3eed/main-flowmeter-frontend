import { Cable } from "lucide-react";
import { columns } from "./columns";
import { Suspense } from "react";
import { dataPolling, dataType } from "@/lib/ConnectionsData";
import ConnectDataTable from "./connectData-table";
import Loading from "@/app/loading";
import { DeviceDB } from "@/types";
import { cookies } from "next/headers";
import { fetchPreferences } from "@/lib/fetchPreferences";

async function getDevices(): Promise<DeviceDB[]> {
  const cookieStore = cookies();

  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join("; ");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader, 
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch devices");

  return await response.json();
}
const tableName = "ConnectionsTable";

export default async function Page() {
  const devices = await getDevices();
  const preferences = await fetchPreferences(tableName);
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <Cable />
            <div className="text-xl font-bold">Connections</div>
          </div>
          <ConnectDataTable
            selectType={dataType}
            selectPolling={dataPolling}
            data={devices}
            columns={columns}
            preferences={preferences}
          />
        </div>
      </div>
    </Suspense>
  );
}
