'use client';

import { RequirePermission } from '@/components/auth/guards';
import { ErrorState } from '@/components/shared/error-state';
import { FormSkeleton } from '@/components/shared/skeletons';
import { useUpdateWorkflow, useWorkflow } from '@/hooks/useWorkflows';
import { WorkflowForm } from './workflow-form';

function EditWorkflowForm({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useWorkflow(id);
  const update = useUpdateWorkflow(id);

  if (isLoading) return <FormSkeleton />;
  if (isError || !data) {
    return <ErrorState message="Could not load this workflow." onRetry={() => refetch()} />;
  }

  // Strip server-only fields; the form only edits these.
  const { name, description, type, status, agents } = data;

  return (
    <WorkflowForm
      key={data.id}
      defaultValues={{ name, description, type, status, agents }}
      submitLabel="Save changes"
      isSubmitting={update.isPending}
      onSubmit={(values) => update.mutate(values)}
    />
  );
}

export function EditWorkflow({ id }: { id: string }) {
  return (
    <RequirePermission permission="workflows:manage">
      <EditWorkflowForm id={id} />
    </RequirePermission>
  );
}
