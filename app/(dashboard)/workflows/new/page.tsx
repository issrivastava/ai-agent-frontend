import { Workflow } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { NewWorkflow } from '@/components/workflows/new-workflow';

export default function NewWorkflowPage() {
  return (
    <>
      <PageHeader
        icon={Workflow}
        title="New workflow"
        description="Start from a template or define the agents that handle this workflow, in order."
      />
      <NewWorkflow />
    </>
  );
}
