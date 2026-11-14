import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ExtractionsPanel } from '@/components/extractions/extractions-panel';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExtractionsPage() {
  return (
    <>
      <PageHeader
        title="Data extraction"
        description="Upload documents and let agents pull out structured data."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ExtractionsPanel />
      </Suspense>
    </>
  );
}