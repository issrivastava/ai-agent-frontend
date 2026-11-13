import { delay, http, HttpResponse } from 'msw';
import { decide, getRun } from './run-store';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export const runHandlers = [
  http.get(`${API}/runs/:id`, async ({ params }) => {
    await delay(200);
    const run = getRun(String(params.id));
    if (!run) return HttpResponse.json({ message: 'Run not found' }, { status: 404 });
    return HttpResponse.json(run);
  }),

  http.post(`${API}/runs/:id/decision`, async ({ params, request }) => {
    await delay(400);
    const { decision } = (await request.json()) as { decision: 'approved' | 'rejected' };
    const run = decide(String(params.id), decision);
    if (!run) return HttpResponse.json({ message: 'Run not found' }, { status: 404 });
    return HttpResponse.json(run);
  }),
];