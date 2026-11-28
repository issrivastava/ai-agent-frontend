export const ticketStatuses = ['open', 'pending', 'escalated', 'resolved', 'closed'] as const;
export const ticketPriorities = ['low', 'medium', 'high', 'urgent'] as const;
export const agents = ['Triage Agent', 'Billing Agent', 'Dispatch Agent'] as const;

export type TicketStatus = (typeof ticketStatuses)[number];
export type TicketPriority = (typeof ticketPriorities)[number];

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  customer: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAgent: string;
  createdAt: string; // ISO date
};

export type TicketFilters = {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedAgent?: string;
  /** ISO date string — tickets created on or after this moment. */
  createdAfter?: string;
};

export const ticketRanges = ['all', 'today', '7d', '30d'] as const;
export type TicketRange = (typeof ticketRanges)[number];

/** Maps a relative range to a cutoff date, or undefined for "all time". */
export function rangeCutoff(range: TicketRange): Date | undefined {
  const now = new Date();
  if (range === 'today') {
    now.setHours(0, 0, 0, 0);
    return now;
  }
  if (range === '7d') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30d') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return undefined;
}

export const rangeLabels: Record<TicketRange, string> = {
  all: 'Any time',
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
};
