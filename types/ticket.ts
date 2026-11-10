export type TicketStatus = 'open' | 'pending' | 'escalated' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAgent: string;
  createdAt: string; // ISO date
};