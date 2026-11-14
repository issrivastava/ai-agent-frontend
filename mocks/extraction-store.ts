import type { ExtractedField, ExtractionJob } from '@/types/extraction';

type Internal = { job: ExtractionJob; createdMs: number; shouldFail: boolean; final: boolean };

// Kept on globalThis so hot reloads don't create a second, empty store.
const g = globalThis as unknown as {
  __extractionStore?: Map<string, Internal>;
  __extractionCounter?: { value: number };
};
const store = (g.__extractionStore ??= new Map<string, Internal>());
const counter = (g.__extractionCounter ??= { value: 4 });

function sampleFields(fileName: string): ExtractedField[] {
  return [
    { field: 'Document', value: fileName.replace(/\.[^.]+$/, ''), confidence: 0.99 },
    { field: 'Vendor', value: 'Sharma Logistics Pvt Ltd', confidence: 0.97 },
    { field: 'Invoice number', value: 'INV-2026-0142', confidence: 0.95 },
    { field: 'Invoice date', value: '2026-11-05', confidence: 0.93 },
    { field: 'Subtotal', value: '₹42,500.00', confidence: 0.9 },
    { field: 'GST (18%)', value: '₹7,650.00', confidence: 0.82 },
    { field: 'Total', value: '₹50,150.00', confidence: 0.96 },
    { field: 'Payment terms', value: 'Net 30', confidence: 0.64 },
  ];
}

function advance(i: Internal) {
  if (i.final) return;
  const elapsed = Date.now() - i.createdMs;
  const { job } = i;

  if (elapsed < 1500) {
    job.status = 'queued';
  } else if (elapsed < 6000) {
    job.status = 'processing';
  } else if (i.shouldFail) {
    job.status = 'failed';
    job.error = 'Could not read this document. The file may be corrupted or password-protected.';
    job.finishedAt = new Date().toISOString();
    i.final = true;
  } else {
    job.status = 'completed';
    job.fields = sampleFields(job.fileName);
    job.finishedAt = new Date().toISOString();
    i.final = true;
  }
}

export function createJob(fileName: string, fileSize: number): ExtractionJob {
  const id = `EXT-${String(counter.value++).padStart(3, '0')}`;
  const job: ExtractionJob = {
    id,
    fileName,
    fileSize,
    status: 'queued',
    createdAt: new Date().toISOString(),
    fields: [],
  };
  store.set(id, { job, createdMs: Date.now(), shouldFail: /fail/i.test(fileName), final: false });
  return job;
}

export function getJob(id: string): ExtractionJob | undefined {
  const i = store.get(id);
  if (!i) return undefined;
  advance(i);
  return i.job;
}

export function listJobs(): ExtractionJob[] {
  return [...store.values()]
    .map((i) => {
      advance(i);
      return i.job;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function seed(job: ExtractionJob) {
  store.set(job.id, { job, createdMs: 0, shouldFail: false, final: true });
}

seed({
  id: 'EXT-001',
  fileName: 'invoice-october.pdf',
  fileSize: 184_320,
  status: 'completed',
  createdAt: '2026-11-10T09:15:00.000Z',
  finishedAt: '2026-11-10T09:15:08.000Z',
  fields: sampleFields('invoice-october.pdf'),
});
seed({
  id: 'EXT-002',
  fileName: 'warehouse-receipt.png',
  fileSize: 902_144,
  status: 'completed',
  createdAt: '2026-11-11T12:30:00.000Z',
  finishedAt: '2026-11-11T12:30:07.000Z',
  fields: sampleFields('warehouse-receipt.png'),
});
seed({
  id: 'EXT-003',
  fileName: 'scan-corrupted.pdf',
  fileSize: 52_224,
  status: 'failed',
  createdAt: '2026-11-12T16:05:00.000Z',
  finishedAt: '2026-11-12T16:05:06.000Z',
  error: 'Could not read this document. The file may be corrupted or password-protected.',
  fields: [],
});