import { StatusTimeline, type TimelineItem } from '@/components/shared/status-timeline';
import type { Ticket, TicketStatus } from '@/types/ticket';

/** Canonical lifecycle stages, in the order a ticket travels through them. */
const stages: { status: TicketStatus; label: string; description: string }[] = [
  { status: 'open', label: 'Opened', description: 'The request arrived in the support queue.' },
  {
    status: 'pending',
    label: 'In progress',
    description: 'An agent picked it up and is working on it.',
  },
  {
    status: 'escalated',
    label: 'Escalated',
    description: 'Flagged for priority handling by a human or a rule.',
  },
  { status: 'resolved', label: 'Resolved', description: 'A solution or answer was delivered.' },
  { status: 'closed', label: 'Closed', description: 'Archived for reference.' },
];

export function ticketStatusTimeline(ticket: Ticket): TimelineItem[] {
  const current = stages.findIndex((stage) => stage.status === ticket.status);
  const created = new Date(ticket.createdAt);

  return stages.map((stage, index) => ({
    id: stage.status,
    label: stage.label,
    description: stage.description,
    status:
      index < current
        ? ('done' as const)
        : index === current
          ? stage.status === 'escalated'
            ? ('attention' as const)
            : ('current' as const)
          : ('upcoming' as const),
    timestamp:
      index === 0
        ? `${created.toLocaleDateString('en-IN')} · ${created.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
        : undefined,
  }));
}

export function TicketStatusTimeline({ ticket }: { ticket: Ticket }) {
  return <StatusTimeline items={ticketStatusTimeline(ticket)} label="Ticket status" />;
}
