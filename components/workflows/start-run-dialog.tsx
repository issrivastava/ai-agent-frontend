'use client';

import { useState } from 'react';
import { Inbox } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStartRun } from '@/hooks/useStartRun';
import { useTickets } from '@/hooks/useTickets';
import type { Workflow } from '@/types/workflow';

export function StartRunDialog({
  workflow,
  onClose,
}: {
  workflow: Workflow | null;
  onClose: () => void;
}) {
  const start = useStartRun();
  const needsTicket = workflow?.type === 'dispatch';
  const { data: tickets, isLoading } = useTickets({ status: 'open' });
  const [selected, setSelected] = useState('');

  const ticketId = selected || tickets?.[0]?.id || '';
  const noTickets = needsTicket && !isLoading && (tickets?.length ?? 0) === 0;

  return (
    <Dialog open={!!workflow} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run {workflow?.name}</DialogTitle>
          <DialogDescription>
            {needsTicket
              ? 'Choose the ticket the agents should work on.'
              : 'This workflow does not use a ticket.'}
          </DialogDescription>
        </DialogHeader>

        {needsTicket && (
          <div className="space-y-2">
            <label htmlFor="run-ticket" className="text-sm font-medium">
              Ticket
            </label>
            <select
              id="run-ticket"
              value={ticketId}
              onChange={(e) => setSelected(e.target.value)}
              disabled={isLoading || noTickets}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {isLoading && <option>Loading tickets…</option>}
              {tickets?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} · {t.subject} ({t.priority})
                </option>
              ))}
            </select>
            {noTickets && (
              <EmptyState
                compact
                icon={Inbox}
                title="No open tickets"
                description="There are no open tickets to work on."
              />
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={start.isPending}>
            Cancel
          </Button>
          <Button
            disabled={start.isPending || (needsTicket && !ticketId)}
            onClick={() =>
              workflow &&
              start.mutate(
                { workflowId: workflow.id, ticketId: needsTicket ? ticketId : undefined },
                { onSuccess: onClose },
              )
            }
          >
            {start.isPending ? 'Starting…' : 'Start run'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
