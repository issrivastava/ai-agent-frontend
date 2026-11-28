import { Suspense } from 'react';
import { DashboardGreeting } from '@/components/dashboard/dashboard-greeting';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { StatGridSkeleton } from '@/components/shared/skeletons';

export default function DashboardPage() {
  return (
    <>
      <DashboardGreeting />
      <Suspense fallback={<StatGridSkeleton />}>
        <DashboardOverview />
      </Suspense>
    </>
  );
}
