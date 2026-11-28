'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/shared/data-table';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Ticket } from '@/types/ticket';

// Sorts priorities by severity instead of alphabetically.
const priorityRank = { low: 0, medium: 1, high: 2, urgent: 3 } as const;

export const ticketColumns: ColumnDef<Ticket>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'subject',
    header: ({ column }) => <SortableHeader column={column} title="Subject" />,
  },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <SortableHeader column={column} title="Priority" />,
    cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    sortingFn: (a, b) => priorityRank[a.original.priority] - priorityRank[b.original.priority],
  },
  { accessorKey: 'assignedAgent', header: 'Agent' },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('en-IN'),
  },
];
