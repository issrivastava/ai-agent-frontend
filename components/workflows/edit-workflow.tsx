'use client';

import { ErrorState } from '@/components/shared/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpdateWorkflow, useWorkflow } from '@/hooks/useWorkflows';
import { WorkflowForm } from './workflow-form';

export function EditWorkflow({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useWorkflow(id);
  const update = useUpdateWorkflow(id);

  if (isLoading) return <Skeleton className="h-96 max-w-3xl" />;
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