'use client';

import { DataTable } from '@/components/shared/data-table';
import { ticketColumns } from './ticket-columns';
import type { Ticket } from '@/types/ticket';

const statuses = ['open', 'pending', 'escalated', 'resolved', 'closed'] as const;
const priorities = ['low', 'medium', 'high', 'urgent'] as const;

// Temporary mock data. Replaced by the useTickets() hook once the API exists.
const mockTickets: Ticket[] = Array.from({ length: 27 }, (_, i) => ({
  id: `TCK-${1001 + i}`,
  subject: ['Refund not received', 'Login issue', 'Invoice mismatch', 'Warehouse slot query'][i % 4],
  customer: `Customer ${i + 1}`,
  status: statuses[i % statuses.length],
  priority: priorities[i % priorities.length],
  assignedAgent: ['Triage Agent', 'Billing Agent', 'Dispatch Agent'][i % 3],
  createdAt: new Date(2026, 10, 1 + (i % 9)).toISOString(),
}));

export function TicketsTable() {
  return (
    <DataTable
      columns={ticketColumns}
      data={mockTickets}
      searchPlaceholder="Search tickets…"
      emptyTitle="No tickets found"
    />
  );
}