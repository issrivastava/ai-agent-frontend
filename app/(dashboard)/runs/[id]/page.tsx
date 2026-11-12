import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';

async function RunContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PageHeader title={`Run ${id}`} description="The live agent viewer is coming next." />;
}

export default function RunPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <RunContent params={params} />
    </Suspense>
  );
}