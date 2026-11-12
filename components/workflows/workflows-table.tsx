'use client';

import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { DataTable } from '@/components/shared/data-table';
import { useDeleteWorkflow, useRunWorkflow, useWorkflows } from '@/hooks/useWorkflows';
import type { Workflow } from '@/types/workflow';
import { getWorkflowColumns } from './workflow-columns';

export function WorkflowsTable() {
  const { data, isLoading, isError, refetch } = useWorkflows();
  const run = useRunWorkflow();
  const remove = useDeleteWorkflow();
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);

  const runningId = run.isPending ? run.variables : undefined;

  const columns = useMemo(
    () =>
      getWorkflowColumns({
        onRun: (wf) => run.mutate(wf.id),
        onDelete: setDeleteTarget,
        runningId,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runningId],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        searchPlaceholder="Search workflows…"
        emptyTitle="No workflows yet"
        emptyDescription="Create your first workflow to start automating."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this workflow?"
        description={`"${deleteTarget?.name}" will be permanently removed. Past runs are not affected.`}
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() =>
          deleteTarget &&
          remove.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }
      />
    </>
  );
}