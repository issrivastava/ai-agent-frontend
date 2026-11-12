import { agents, ticketPriorities, ticketStatuses, type Ticket } from '@/types/ticket';

const subjects = [
  'Refund not received',
  'Login issue',
  'Invoice mismatch',
  'Warehouse slot query',
];

export const initialTickets: Ticket[] = Array.from({ length: 27 }, (_, i) => ({
  id: `TCK-${1001 + i}`,
  subject: subjects[i % subjects.length],
  description: `Customer ${i + 1} reported: "${subjects[i % subjects.length]}". Please review the account history and respond within the SLA.`,
  customer: `Customer ${i + 1}`,
  status: ticketStatuses[i % ticketStatuses.length],
  priority: ticketPriorities[i % ticketPriorities.length],
  assignedAgent: agents[i % agents.length],
  createdAt: new Date(Date.UTC(2026, 10, 1 + (i % 9))).toISOString(),
}));