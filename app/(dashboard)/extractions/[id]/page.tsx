import { Suspense } from 'react';
import { FileSearch } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ExtractionViewer } from '@/components/extractions/extraction-viewer';
import { DetailSkeleton } from '@/components/shared/skeletons';

async function JobContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PageHeader
        icon={FileSearch}
        title={`Extraction ${id}`}
        description="Status and extracted fields for this document."
      />
      <ExtractionViewer id={id} />
    </>
  );
}

export default function ExtractionJobPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<DetailSkeleton className="max-w-4xl" />}>
      <JobContent params={params} />
    </Suspense>
  );
}
