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
};