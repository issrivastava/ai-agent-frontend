import type { ExtractionJob } from '@/types/extraction';
import type { Run } from '@/types/run';
import { ticketStatuses, type Ticket } from '@/types/ticket';

const isActiveRun = (r: Run) => r.status === 'running' || r.status === 'waiting_approval';

export function ticketStats(tickets: Ticket[]) {
  const open = tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed');
  return {
    total: tickets.length,
    open: open.length,
    urgentOpen: open.filter((t) => t.priority === 'urgent').length,
    byStatus: ticketStatuses.map((status) => ({
      status,
      count: tickets.filter((t) => t.status === status).length,
    })),
  };
}

export function runStats(runs: Run[]) {
  const finished = runs.filter((r) => r.status === 'completed' || r.status === 'failed');
  const completed = finished.filter((r) => r.status === 'completed');

  const durations = finished
    .filter((r) => r.finishedAt)
    .map((r) => (new Date(r.finishedAt!).getTime() - new Date(r.startedAt).getTime()) / 1000);

  // Group by day using the data's own dates (no "today"), then keep the latest 7 days.
  const days = new Map<string, { completed: number; failed: number; active: number }>();
  for (const r of runs) {
    const day = r.startedAt.slice(0, 10);
    const entry = days.get(day) ?? { completed: 0, failed: 0, active: 0 };
    if (r.status === 'completed') entry.completed += 1;
    else if (r.status === 'failed') entry.failed += 1;
    else entry.active += 1;
    days.set(day, entry);
  }
  const perDay = [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([day, v]) => ({
      day: new Date(day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
      ...v,
    }));

  return {
    total: runs.length,
    active: runs.filter(isActiveRun).length,
    awaitingApproval: runs.filter((r) => r.status === 'waiting_approval'),
    successRate: finished.length ? Math.round((completed.length / finished.length) * 100) : null,
    avgSeconds: durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null,
    perDay,
    recent: [...runs].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 5),
  };
}

export function extractionStats(jobs: ExtractionJob[]) {
  const finished = jobs.filter((j) => j.status === 'completed' || j.status === 'failed');
  const completed = finished.filter((j) => j.status === 'completed');
  return {
    total: jobs.length,
    completed: completed.length,
    inProgress: jobs.filter((j) => j.status === 'queued' || j.status === 'processing').length,
    successRate: finished.length ? Math.round((completed.length / finished.length) * 100) : null,
  };
}