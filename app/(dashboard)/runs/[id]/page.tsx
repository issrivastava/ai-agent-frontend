import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { RunViewer } from '@/components/runs/run-viewer';
import { Skeleton } from '@/components/ui/skeleton';

async function RunContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PageHeader title={`Run ${id}`} description="Live view of what each agent is doing." />
      <RunViewer id={id} />
    </>
  );
}

export default function RunPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="h-96 max-w-3xl" />}>
      <RunContent params={params} />
    </Suspense>
  );
}