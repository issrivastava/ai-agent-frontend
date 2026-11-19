import type { AgentRole } from './workflow';

export type RunStatus = 'running' | 'waiting_approval' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'running' | 'waiting_approval' | 'completed' | 'failed';

export type RunStep = {
  id: string;
  agent: AgentRole;
  action: string;
  tool?: string;
  status: StepStatus;
  durationMs?: number;
  output?: string;
  requiresApproval: boolean;
  approval?: 'approved' | 'rejected';
};

export type Run = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: RunStatus;
  startedAt: string;
  finishedAt?: string;
  steps: RunStep[];
};