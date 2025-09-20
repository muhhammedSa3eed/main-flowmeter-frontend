import { Report, RFP } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const fakeReports: Report[] = [
  {
    id: 1,
    name: "Monthly Sales Report",
    createdAt: "2025-09-01",
  },
  {
    id: 2,
    name: "Employee Attendance Report",
    createdAt: "2025-08-28",
  },
  {
    id: 3,
    name: "Customer Feedback Report",
    createdAt: "2025-08-20",
  },
  {
    id: 4,
    name: "Project Progress Report",
    createdAt: "2025-08-15",
  },
  {
    id: 5,
    name: "Financial Summary Report",
    createdAt: "2025-08-10",
  },
];
export default function RfpReports({ RFpData  }: { RFpData: RFP[] ,}) {


  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {fakeReports.map((report) => {

        return (
          <Card
            key={report.id}
            className="@container/card p-2 flex flex-col justify-between"
          >
            <div>
              <CardHeader>
                <CardDescription
             
                >
                 {report.createdAt }
                </CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {report.name }
                </CardTitle>
              </CardHeader>
            </div>

            <CardFooter className="flex flex-col gap-2 text-sm px-2">
              <Link href={`/dashboard/RfpReports/${RFpData[0]?.id ?? 0}/report/${report.id}`} className="w-full">
                <Button variant="custom" className="w-full gap-2">
                  View Report 
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
