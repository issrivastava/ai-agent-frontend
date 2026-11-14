import { runHandlers } from './run-handlers';
import { workflowHandlers } from './workflow-handlers';
import { delay, http, HttpResponse } from 'msw';
import type { Ticket } from '@/types/ticket';
import { initialTickets } from './data';
import { extractionHandlers } from './extraction-handlers';

// Must match the base URL your axios client uses.
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

// In-memory "database". Edits survive until you refresh the page.
const tickets: Ticket[] = structuredClone(initialTickets);

export const handlers = [
  http.get(`${API}/tickets`, async ({ request }) => {
    await delay(500);
    const params = new URL(request.url).searchParams;
    const status = params.get('status');
    const priority = params.get('priority');

    const result = tickets.filter(
      (t) => (!status || t.status === status) && (!priority || t.priority === priority),
    );
    return HttpResponse.json(result);
  }),

  http.get(`${API}/tickets/:id`, async ({ params }) => {
    await delay(300);
    const ticket = tickets.find((t) => t.id === String(params.id));
    if (!ticket) return HttpResponse.json({ message: 'Ticket not found' }, { status: 404 });
    return HttpResponse.json(ticket);
  }),

  http.patch(`${API}/tickets/:id`, async ({ params, request }) => {
    await delay(600);
    const ticket = tickets.find((t) => t.id === String(params.id));
    if (!ticket) return HttpResponse.json({ message: 'Ticket not found' }, { status: 404 });

    const body = (await request.json()) as Partial<Pick<Ticket, 'assignedAgent' | 'status'>>;
    Object.assign(ticket, body);
    return HttpResponse.json(ticket);
  }),
  ...workflowHandlers,
  ...runHandlers,
  ...extractionHandlers,
];