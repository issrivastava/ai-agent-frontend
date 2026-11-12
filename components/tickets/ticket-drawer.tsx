'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ErrorState } from '@/components/shared/error-state';
import { FilterSelect } from '@/components/shared/filter-select';
import { StatusBadge } from '@/components/shared/status-badge';
import { useReassignTicket, useTicket } from '@/hooks/useTickets';
import { agents, type Ticket } from '@/types/ticket';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function TicketDetails({ ticket }: { ticket: Ticket }) {
  const [agent, setAgent] = useState<string>(ticket.assignedAgent);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const reassign = useReassignTicket();

  return (
    <div className="space-y-5 px-4 pb-4">
      <div className="flex items-center gap-2">
        <StatusBadge status={ticket.status} />
        <span className="text-sm capitalize text-muted-foreground">{ticket.priority} priority</span>
      </div>

      <Field label="Customer">{ticket.customer}</Field>
      <Field label="Created">{new Date(ticket.createdAt).toLocaleString('en-IN')}</Field>
      <Field label="Description">{ticket.description}</Field>
      <Field label="Assigned agent">{ticket.assignedAgent}</Field>

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm font-medium">Reassign ticket</p>
        <div className="flex gap-2">
          <FilterSelect
            label="Agents"
            value={agent}
            onChange={setAgent}
            options={agents}
            className="flex-1"
          />
          <Button
            disabled={agent === 'all' || agent === ticket.assignedAgent || reassign.isPending}
            onClick={() => setConfirmOpen(true)}
          >
            Reassign
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Reassign this ticket?"
        description={`${ticket.id} will move from ${ticket.assignedAgent} to ${agent}.`}
        confirmLabel="Reassign"
        loading={reassign.isPending}
        onConfirm={() =>
          reassign.mutate(
            { id: ticket.id, assignedAgent: agent },
            { onSuccess: () => setConfirmOpen(false) },
          )
        }
      />
    </div>
  );
}

export function TicketDrawer({
  ticketId,
  onClose,
}: {
  ticketId: string | null;
  onClose: () => void;
}) {
  const { data: ticket, isLoading, isError, refetch } = useTicket(ticketId);

  return (
    <Sheet open={!!ticketId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{ticket?.subject ?? 'Ticket details'}</SheetTitle>
          <SheetDescription>{ticketId}</SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="space-y-4 px-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {isError && <ErrorState message="Could not load this ticket." onRetry={() => refetch()} />}
        {ticket && <TicketDetails key={ticket.id} ticket={ticket} />}
      </SheetContent>
    </Sheet>
  );
}