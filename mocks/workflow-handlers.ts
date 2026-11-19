import { createRun } from './run-store';
import { delay, http, HttpResponse } from 'msw';
import type { Workflow, WorkflowInput } from '@/types/workflow';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const workflows: Workflow[] = [
  {
    id: 'WF-001',
    name: 'Support ticket triage',
    description: 'Classifies incoming tickets and routes them to the right team.',
    type: 'dispatch',
    status: 'active',
    agents: [
      { role: 'triage', prompt: 'Classify the ticket by topic and urgency.', tools: ['ticket_lookup'] },
      { role: 'billing', prompt: 'Handle billing and refund questions.', tools: ['invoice_search', 'refund_api'] },
      { role: 'dispatch', prompt: 'Assign the ticket to the best available human or agent.', tools: ['assign_ticket'] },
    ],
    updatedAt: new Date(Date.UTC(2026, 10, 8)).toISOString(),
  },
  {
    id: 'WF-002',
    name: 'Invoice data extraction',
    description: 'Extracts line items and totals from uploaded invoices.',
    type: 'extraction',
    status: 'active',
    agents: [
      { role: 'extractor', prompt: 'Extract vendor, date, line items, and total as JSON.', tools: ['pdf_reader', 'ocr'] },
    ],
    updatedAt: new Date(Date.UTC(2026, 10, 9)).toISOString(),
  },
  {
    id: 'WF-003',
    name: 'Warehouse slot dispatch',
    description: 'Matches booking requests to available warehouse slots.',
    type: 'dispatch',
    status: 'draft',
    agents: [{ role: 'dispatch', prompt: 'Find the closest available slot.', tools: ['slot_search'] }],
    updatedAt: new Date(Date.UTC(2026, 10, 10)).toISOString(),
  },
];

let nextWorkflow = 4;

export const workflowHandlers = [
  http.get(`${API}/workflows`, async () => {
    await delay(400);
    return HttpResponse.json(workflows);
  }),

  http.get(`${API}/workflows/:id`, async ({ params }) => {
    await delay(300);
    const wf = workflows.find((w) => w.id === String(params.id));
    if (!wf) return HttpResponse.json({ message: 'Workflow not found' }, { status: 404 });
    return HttpResponse.json(wf);
  }),

  http.post(`${API}/workflows`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as WorkflowInput;
    const wf: Workflow = {
      ...body,
      id: `WF-${String(nextWorkflow++).padStart(3, '0')}`,
      updatedAt: new Date().toISOString(),
    };
    workflows.unshift(wf);
    return HttpResponse.json(wf, { status: 201 });
  }),

  http.patch(`${API}/workflows/:id`, async ({ params, request }) => {
    await delay(500);
    const wf = workflows.find((w) => w.id === String(params.id));
    if (!wf) return HttpResponse.json({ message: 'Workflow not found' }, { status: 404 });
    Object.assign(wf, (await request.json()) as Partial<WorkflowInput>, {
      updatedAt: new Date().toISOString(),
    });
    return HttpResponse.json(wf);
  }),

  http.delete(`${API}/workflows/:id`, async ({ params }) => {
    await delay(500);
    const index = workflows.findIndex((w) => w.id === String(params.id));
    if (index === -1) return HttpResponse.json({ message: 'Workflow not found' }, { status: 404 });
    workflows.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API}/workflows/:id/run`, async ({ params }) => {
    await delay(700);
    const wf = workflows.find((w) => w.id === String(params.id));
    if (!wf) return HttpResponse.json({ message: 'Workflow not found' }, { status: 404 });
    if (wf.status !== 'active') {
      return HttpResponse.json({ message: 'Only active workflows can be run' }, { status: 400 });
    }
    const run = createRun(wf);
    return HttpResponse.json({ runId: run.id }, { status: 201 });
    }),
];