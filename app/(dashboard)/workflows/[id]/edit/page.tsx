import { Suspense } from 'react';
import { Workflow } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { FormSkeleton } from '@/components/shared/skeletons';
import { EditWorkflow } from '@/components/workflows/edit-workflow';

async function EditContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditWorkflow id={id} />;
}

export default function EditWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <PageHeader
        icon={Workflow}
        title="Edit workflow"
        description="Changes apply to future runs."
      />
      <Suspense fallback={<FormSkeleton />}>
        <EditContent params={params} />
      </Suspense>
    </>
  );
}
