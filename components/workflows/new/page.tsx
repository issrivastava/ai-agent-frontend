import { PageHeader } from '@/components/layout/page-header';
import { NewWorkflow } from '@/components/workflows/new-workflow';

export default function NewWorkflowPage() {
  return (
    <>
      <PageHeader title="New workflow" description="Define the agents that handle this workflow, in order." />
      <NewWorkflow />
    </>
  );
}