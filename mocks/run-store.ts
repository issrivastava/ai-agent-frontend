import type { Run, RunStep } from '@/types/run';
import type { Workflow } from '@/types/workflow';

const STEP_MS = 2500;
const RISKY_TOOLS = ['refund_api', 'email_sender'];

type Internal = { run: Run; cursor: number; stepStartedAt: number };

const store = new Map<string, Internal>();
let counter = 101;

export function createRun(wf: Workflow): Run {
  const id = `RUN-${counter++}`;
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