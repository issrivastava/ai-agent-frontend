'use client';

import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { DataTable } from '@/components/shared/data-table';
import { StartRunDialog } from '@/components/workflows/start-run-dialog';
import { useDeleteWorkflow, useWorkflows } from '@/hooks/useWorkflows';
import { useAuth } from '@/providers/auth-provider';
import type { Workflow } from '@/types/workflow';
import { getWorkflowColumns } from './workflow-columns';

export function WorkflowsTable() {
  const { can } = useAuth();
  const { data, isLoading, isError, refetch } = useWorkflows();
  const remove = useDeleteWorkflow();
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);
  const [runTarget, setRunTarget] = useState<Workflow | null>(null);

  const canRun = can('workflows:run');
  const canManage = can('workflows:manage');

  const columns = useMemo(
    () =>
      getWorkflowColumns({
        onRun: setRunTarget,
        onDelete: setDeleteTarget,
        canRun,
        canManage,
      }),
    [canRun, canManage],
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
        emptyDescription={
          canManage
            ? 'Create your first workflow to start automating.'
            : 'No workflows have been set up yet.'
        }
      />

      <StartRunDialog
        key={runTarget?.id ?? 'none'}
        workflow={runTarget}
        onClose={() => setRunTarget(null)}
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