'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Hash,
  History,
  Loader2,
  ShieldAlert,
  UserCog,
  UserRound,
} from 'lucide-react';
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
import { useAuth } from '@/providers/auth-provider';
import { agents, type Ticket } from '@/types/ticket';
import { PriorityBadge } from '../shared/priority-badge';
import { TicketStatusTimeline } from './ticket-timeline';

function MetaCard({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        <Icon className="size-3" />
        {label}
      </p>
      <div className="mt-1.5 text-sm">{children}</div>
    </div>
  );
}

function TicketDetails({ ticket }: { ticket: Ticket }) {
  const { can } = useAuth();
  const [agent, setAgent] = useState<string>(ticket.assignedAgent);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const reassign = useReassignTicket();
  const createdAt = new Date(ticket.createdAt);

  return (
    <div className="space-y-4 px-4 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
          <Hash className="size-3" />
          {ticket.id}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MetaCard icon={UserRound} label="Customer">
          <p className="font-medium">{ticket.customer}</p>
        </MetaCard>
        <MetaCard icon={CalendarDays} label="Created">
          <p className="font-medium">{createdAt.toLocaleDateString('en-IN')}</p>
          <p className="text-[11px] text-muted-foreground">
            {createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </MetaCard>
      </div>

      <div className="rounded-xl border p-3">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          <ShieldAlert className="size-3" />
          Description
        </p>
        <p className="mt-2 text-sm leading-relaxed">{ticket.description}</p>
      </div>

      <div className="rounded-xl border p-3">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          <History className="size-3" />
          Status timeline
        </p>
        <div className="mt-3">
          <TicketStatusTimeline ticket={ticket} />
        </div>
      </div>

      <div className="rounded-xl border p-3">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          <UserCog className="size-3" />
          Assigned agent
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-1">
            {ticket.assignedAgent.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-medium capitalize">{ticket.assignedAgent}</p>
            <p className="text-[11px] text-muted-foreground">Current owner</p>
          </div>
        </div>
      </div>

      {can('tickets:reassign') && (
        <>
          <div className="space-y-2 border-t pt-4">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <UserCog className="size-3.5 text-brand-1" />
              Reassign ticket
            </p>
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
                className="bg-brand-gradient text-white hover:brightness-105"
              >
                {reassign.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Reassign'}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Only roles with the reassign permission can do this. The change is logged.
            </p>
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
        </>
      )}
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
          <SheetDescription>
            Everything your agents and team know about this request.
          </SheetDescription>
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
