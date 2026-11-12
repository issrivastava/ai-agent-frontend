import { z } from 'zod';
import { agentRoles, workflowStatuses, workflowTypes } from '@/types/workflow';

export const workflowSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(80, 'Name is too long'),
  description: z.string().max(300, 'Keep the description under 300 characters'),
  type: z.enum(workflowTypes),
  status: z.enum(workflowStatuses),
  agents: z
    .array(
      z.object({
        role: z.enum(agentRoles),
        prompt: z.string().min(10, 'Describe what this agent should do (10+ characters)'),
        tools: z.array(z.string()),
      }),
    )
    .min(1, 'Add at least one agent'),
});

export type WorkflowFormValues = z.infer<typeof workflowSchema>;