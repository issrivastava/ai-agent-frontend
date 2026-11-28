import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusTimeline, type TimelineItem } from '@/components/shared/status-timeline';
import { TicketStatusTimeline, ticketStatusTimeline } from '@/components/tickets/ticket-timeline';
import type { Ticket } from '@/types/ticket';

const ticket: Ticket = {
  id: 'TCK-100',
  subject: 'Slot booking disputed',
  description: 'Customer says the slot was double booked.',
  customer: 'Acme Corp',
  status: 'pending',
  priority: 'high',
  assignedAgent: 'Triage Agent',
  createdAt: '2026-11-20T09:30:00.000Z',
};

describe('StatusTimeline', () => {
  const items: TimelineItem[] = [
    { id: 'a', label: 'Opened', status: 'done', timestamp: '20 Nov · 03:00 pm' },
    { id: 'b', label: 'In progress', status: 'current' },
    { id: 'c', label: 'Closed', status: 'upcoming' },
  ];

  it('renders every item label and timestamp', () => {
    render(<StatusTimeline items={items} label="Ticket status" />);
    expect(screen.getByRole('list', { name: 'Ticket status' })).toBeInTheDocument();
    expect(screen.getByText('Opened')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('20 Nov · 03:00 pm')).toBeInTheDocument();
  });

  it('marks only the current step with aria-current', () => {
    const { container } = render(<StatusTimeline items={items} />);
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(screen.getByText('In progress').closest('[aria-current="step"]')).toBeTruthy();
  });
});

describe('ticketStatusTimeline', () => {
  it('marks earlier stages done, the current one current, later ones upcoming', () => {
    const stages = ticketStatusTimeline(ticket);
    const byId = Object.fromEntries(stages.map((s) => [s.id, s.status]));
    expect(byId.open).toBe('done');
    expect(byId.pending).toBe('current');
    expect(byId.escalated).toBe('upcoming');
    expect(byId.resolved).toBe('upcoming');
    expect(byId.closed).toBe('upcoming');
  });

  it('uses the attention tone for an escalated ticket', () => {
    const stages = ticketStatusTimeline({ ...ticket, status: 'escalated' });
    const escalated = stages.find((s) => s.id === 'escalated');
    expect(escalated?.status).toBe('attention');
  });

  it('renders the timeline in the drawer component', () => {
    render(<TicketStatusTimeline ticket={ticket} />);
    expect(screen.getByRole('list', { name: 'Ticket status' })).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
  });
});
