'use client';

import Link from 'next/link';
import { Play, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Workflow } from '@/types/workflow';

type Actions = {
  onRun: (wf: Workflow) => void;
  onDelete: (wf: Workflow) => void;
  runningId?: string;
};

export function getWorkflowColumns({ onRun, onDelete, runningId }: Actions): ColumnDef<Workflow>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="max-w-xs truncate text-xs text-muted-foreground">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
    },
    {
      id: 'agents',
      header: 'Agents',
      accessorFn: (wf) => wf.agents.map((a) => a.role).join(' '),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.agents.length} ({row.original.agents.map((a) => a.role).join(', ')})
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <SortableHeader column={column} title="Updated" />,
      cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString('en-IN'),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => {
        const wf = row.original;
        return (
          <div className="flex justify-end gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={wf.status !== 'active' || runningId === wf.id}
              onClick={() => onRun(wf)}
            >
              <Play className="size-3.5" />
              {runningId === wf.id ? 'Starting…' : 'Run'}
            </Button>
            <Link
              href={`/workflows/${wf.id}/edit`}
              className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }))}
            >
              Edit
            </Link>
            <Button size="sm" variant="ghost" aria-label={`Delete ${wf.name}`} onClick={() => onDelete(wf)}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];
}