import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EditWorkflow } from '@/components/workflows/edit-workflow';
import { Skeleton } from '@/components/ui/skeleton';

async function EditContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditWorkflow id={id} />;
}

export default function EditWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <PageHeader title="Edit workflow" description="Changes apply to future runs." />
      <Suspense fallback={<Skeleton className="h-96 max-w-3xl" />}>
        <EditContent params={params} />
      </Suspense>
    </>
  );
}