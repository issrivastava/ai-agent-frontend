import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your agents and support queue." />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <DashboardOverview />
      </Suspense>
    </>
  );
}