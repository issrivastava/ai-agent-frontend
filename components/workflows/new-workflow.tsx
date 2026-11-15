'use client';

import { RequirePermission } from '@/components/auth/guards';
import { useCreateWorkflow } from '@/hooks/useWorkflows';
import { WorkflowForm } from './workflow-form';

export function NewWorkflow() {
  const create = useCreateWorkflow();
  return (
    <RequirePermission permission="workflows:manage">
      <WorkflowForm
        submitLabel="Create workflow"
        isSubmitting={create.isPending}
        onSubmit={(values) => create.mutate(values)}
      />
    </RequirePermission>
  );
}