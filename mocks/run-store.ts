import type { Run, RunStep } from '@/types/run';
import type { Workflow } from '@/types/workflow';

const STEP_MS = 2500;
const RISKY_TOOLS = ['refund_api', 'email_sender'];

type Internal = { run: Run; cursor: number; stepStartedAt: number };

// Kept on globalThis so hot reloads of this file don't create a second, empty store.
const g = globalThis as unknown as {
  __runStore?: Map<string, Internal>;
  __runCounter?: { value: number };
};
const store = (g.__runStore ??= new Map<string, Internal>());
const counter = (g.__runCounter ??= { value: 101 });

export function createRun(wf: Workflow): Run {
  const id = `RUN-${counter.value++}`;
    const steps: RunStep[] = wf.agents.map((agent, i) => ({
    id: `${id}-s${i + 1}`,
    agent: agent.role,
    action: agent.prompt,
    tool: agent.tools[0],
    status: i === 0 ? 'running' : 'pending',
    requiresApproval: agent.tools.some((t) => RISKY_TOOLS.includes(t)),
  }));

  const run: Run = {
    id,
    workflowId: wf.id,
    workflowName: wf.name,
    status: 'running',
    startedAt: new Date().toISOString(),
    steps,
  };
  store.set(id, { run, cursor: 0, stepStartedAt: Date.now() });
  return run;
}

function advance(i: Internal) {
  const { run } = i;
  const now = Date.now();

  while (run.status === 'running') {
    const step = run.steps[i.cursor];
    if (!step) {
      run.status = 'completed';
      run.finishedAt = new Date(now).toISOString();
      return;
    }
    if (now - i.stepStartedAt < STEP_MS) return;

    if (step.requiresApproval && step.approval === undefined) {
      step.status = 'waiting_approval';
      run.status = 'waiting_approval';
      return;
    }

    step.status = 'completed';
    step.durationMs = STEP_MS;
    step.output = `${step.agent} agent finished${step.tool ? ` using ${step.tool}` : ''}.`;
    i.cursor += 1;
    i.stepStartedAt += STEP_MS;
    const next = run.steps[i.cursor];
    if (next) next.status = 'running';
  }
}

export function getRun(id: string): Run | undefined {
  const i = store.get(id);
  if (!i) return undefined;
  advance(i);
  return i.run;
}

export function decide(id: string, decision: 'approved' | 'rejected'): Run | undefined {
  const i = store.get(id);
  if (!i) return undefined;
  advance(i);

  const step = i.run.steps[i.cursor];
  if (i.run.status !== 'waiting_approval' || !step) return i.run;

  step.approval = decision;
  if (decision === 'approved') {
    step.status = 'running';
    i.run.status = 'running';
    i.stepStartedAt = Date.now();
  } else {
    step.status = 'failed';
    step.output = 'Rejected by reviewer.';
    i.run.status = 'failed';
    i.run.finishedAt = new Date().toISOString();
  }
  return i.run;
}

export function listRuns(): Run[] {
  const all = [...store.values()].map((i) => {
    advance(i);
    return i.run;
  });
  return all.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

function seed(
  id: string,
  workflowId: string,
  workflowName: string,
  status: 'completed' | 'failed',
  startedAt: string,
  seconds: number,
  steps: Pick<RunStep, 'agent' | 'action' | 'tool'>[],
) {
  const finishedAt = new Date(new Date(startedAt).getTime() + seconds * 1000).toISOString();
  const run: Run = {
    id,
    workflowId,
    workflowName,
    status,
    startedAt,
    finishedAt,
    steps: steps.map((s, i) => {
      const failedHere = status === 'failed' && i === steps.length - 1;
      return {
        id: `${id}-s${i + 1}`,
        ...s,
        status: failedHere ? 'failed' : status === 'failed' && i > steps.length - 1 ? 'pending' : 'completed',
        durationMs: 2500,
        output: failedHere ? 'Rejected by reviewer.' : `${s.agent} agent finished.`,
        requiresApproval: false,
      } satisfies RunStep;
    }),
  };
  store.set(id, { run, cursor: run.steps.length, stepStartedAt: 0 });
}

seed('RUN-098', 'WF-002', 'Invoice data extraction', 'completed', '2026-11-10T09:15:00.000Z', 8, [
  { agent: 'extractor', action: 'Extract vendor, date, line items, and total as JSON.', tool: 'pdf_reader' },
]);
seed('RUN-099', 'WF-001', 'Support ticket triage', 'completed', '2026-11-11T11:02:00.000Z', 14, [
  { agent: 'triage', action: 'Classify the ticket by topic and urgency.', tool: 'ticket_lookup' },
  { agent: 'dispatch', action: 'Assign the ticket to the best available agent.', tool: 'assign_ticket' },
]);
seed('RUN-100', 'WF-001', 'Support ticket triage', 'failed', '2026-11-12T14:40:00.000Z', 9, [
  { agent: 'triage', action: 'Classify the ticket by topic and urgency.', tool: 'ticket_lookup' },
  { agent: 'billing', action: 'Handle billing and refund questions.', tool: 'refund_api' },
]);