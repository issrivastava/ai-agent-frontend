import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { RunsTable } from '@/components/runs/runs-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function RunsPage() {
  return (
    <>
      <PageHeader title="Agent runs" description="History of every workflow run and its outcome." />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <RunsTable />
      </Suspense>
    </>
  );
}