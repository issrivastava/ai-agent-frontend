export const workflowTypes = ['dispatch', 'extraction'] as const;
export const workflowStatuses = ['draft', 'active', 'paused'] as const;
export const agentRoles = ['triage', 'billing', 'dispatch', 'extractor'] as const;

export type WorkflowType = (typeof workflowTypes)[number];
export type WorkflowStatus = (typeof workflowStatuses)[number];
export type AgentRole = (typeof agentRoles)[number];

export type WorkflowAgent = {
  role: AgentRole;
  prompt: string;
  tools: string[];
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
  status: WorkflowStatus;
  agents: WorkflowAgent[];
  updatedAt: string; // ISO date
};

// What the create/edit form sends. The server adds id and updatedAt.
export type WorkflowInput = Omit<Workflow, 'id' | 'updatedAt'>;