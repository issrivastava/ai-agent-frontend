import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { TicketsTable } from '@/components/tickets/tickets-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketsPage() {
  return (
    <>
      <PageHeader title="Tickets" description="Customer support queue handled by your agents." />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TicketsTable />
      </Suspense>
    </>
  );
}