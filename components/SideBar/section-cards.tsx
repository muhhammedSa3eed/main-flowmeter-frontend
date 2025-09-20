import { DashboardStats } from '@/types';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Cable, Users, Webhook } from 'lucide-react';

export default async function SectionCards({
  dashboard,
}: {
  dashboard: DashboardStats;
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card py-2">
        <CardHeader>
          <CardDescription>Total devices</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboard.connectionCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total of devices <Cable className="size-4" />
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card py-2">
        <CardHeader>
          <CardDescription>Total users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboard.userCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total of users <Users className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2">
        <CardHeader>
          <CardDescription>Total flow-meter</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboard.rfpCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total of flow-meter <Webhook className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
