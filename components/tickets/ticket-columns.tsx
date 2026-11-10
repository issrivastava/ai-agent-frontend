'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Ticket } from '@/types/ticket';

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
    cell: ({ row }) => <span className="capitalize">{row.original.priority}</span>,
  },
  { accessorKey: 'assignedAgent', header: 'Agent' },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('en-IN'),
  },
];