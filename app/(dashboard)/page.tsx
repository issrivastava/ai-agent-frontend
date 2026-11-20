import { Suspense } from 'react';
import { DashboardGreeting } from '@/components/dashboard/dashboard-greeting';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <>
      <DashboardGreeting />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <DashboardOverview />
      </Suspense>
    </>
  );
}