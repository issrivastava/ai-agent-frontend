'use client';

import { useState } from 'react';
import { DataTable } from '@/components/shared/data-table';
import { FilterSelect } from '@/components/shared/filter-select';
import { useTickets } from '@/hooks/useTickets';
import {
  ticketPriorities,
  ticketStatuses,
  type TicketPriority,
  type TicketStatus,
} from '@/types/ticket';
import { ticketColumns } from './ticket-columns';
import { TicketDrawer } from './ticket-drawer';

export function TicketsTable() {
  const [status, setStatus] = useState<TicketStatus | 'all'>('all');
  const [priority, setPriority] = useState<TicketPriority | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useTickets({
    status: status === 'all' ? undefined : status,
    priority: priority === 'all' ? undefined : priority,
  });

  return (
    <>
      <DataTable
        columns={ticketColumns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        searchPlaceholder="Search tickets…"
        emptyTitle="No tickets found"
        onRowClick={(ticket) => setSelectedId(ticket.id)}
        toolbar={
          <>
            <FilterSelect
              label="Statuses"
              value={status}
              onChange={(v) => setStatus(v as TicketStatus | 'all')}
              options={ticketStatuses}
            />
            <FilterSelect
              label="Priorities"
              value={priority}
              onChange={(v) => setPriority(v as TicketPriority | 'all')}
              options={ticketPriorities}
            />
          </>
        }
      />
      <TicketDrawer ticketId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}