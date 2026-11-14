import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ExtractionViewer } from '@/components/extractions/extraction-viewer';
import { Skeleton } from '@/components/ui/skeleton';

async function JobContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PageHeader title={`Extraction ${id}`} description="Status and extracted fields for this document." />
      <ExtractionViewer id={id} />
    </>
  );
}

export default function ExtractionJobPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="h-96 max-w-4xl" />}>
      <JobContent params={params} />
    </Suspense>
  );
}