'use client';

import { useCreateWorkflow } from '@/hooks/useWorkflows';
import { WorkflowForm } from './workflow-form';

export function NewWorkflow() {
  const create = useCreateWorkflow();
  return (
    <WorkflowForm
      submitLabel="Create workflow"
      isSubmitting={create.isPending}
      onSubmit={(values) => create.mutate(values)}
    />
  );
}