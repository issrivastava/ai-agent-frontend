'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { useRuns } from '@/hooks/useRun';
import type { Run } from '@/types/run';

function formatDuration(run: Run) {
  if (!run.finishedAt) return '—';
  const seconds = Math.round(
    (new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000,
  );
  return `${seconds}s`;
}

const columns: ColumnDef<Run>[] = [
  {
    accessorKey: 'id',
    header: 'Run',
    cell: ({ row }) => (
      <Link
        href={`/runs/${row.original.id}`}
        className="font-medium underline-offset-4 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: 'workflowName',
    header: ({ column }) => <SortableHeader column={column} title="Workflow" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'progress',
    header: 'Steps',
    cell: ({ row }) => {
      const done = row.original.steps.filter((s) => s.status === 'completed').length;
      return `${done} / ${row.original.steps.length}`;
    },
  },
  {
    accessorKey: 'startedAt',
    header: ({ column }) => <SortableHeader column={column} title="Started" />,
    cell: ({ row }) => new Date(row.original.startedAt).toLocaleString('en-IN'),
  },
  {
    id: 'duration',
    header: 'Duration',
    cell: ({ row }) => formatDuration(row.original),
  },
];

export function RunsTable() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useRuns();

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      searchPlaceholder="Search runs…"
      emptyTitle="No runs yet"
      emptyDescription="Run a workflow and it will appear here."
      onRowClick={(run) => router.push(`/runs/${run.id}`)}
    />
  );
}