import {   Unplug } from "lucide-react";
import { Suspense } from "react";
import { dataPolling, dataType } from "@/lib/ConnectionsData";
import Loading from "@/app/loading";

import AddConnections from "@/components/CRUD/Connections/AddConnections";



export default async function Page() {

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
          <Unplug />
            <div className="text-xl font-bold">Add Connections</div>
          </div>
         <AddConnections selectType={dataType} selectPolling={dataPolling}/>
        </div>
      </div>
    </Suspense>
  );
}
