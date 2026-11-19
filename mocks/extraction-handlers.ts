import { delay, http, HttpResponse } from 'msw';
import { createJob, getJob, listJobs } from './extraction-store';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export const extractionHandlers = [
  http.get(`${API}/extractions`, async () => {
    await delay(400);
    return HttpResponse.json(listJobs());
  }),

  http.get(`${API}/extractions/:id`, async ({ params }) => {
    await delay(200);
    const job = getJob(String(params.id));
    if (!job) return HttpResponse.json({ message: 'Extraction job not found' }, { status: 404 });
    return HttpResponse.json(job);
  }),

  http.post(`${API}/extractions`, async ({ request }) => {
    await delay(800);
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return HttpResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }
    return HttpResponse.json(createJob(file.name, file.size), { status: 201 });
  }),
];