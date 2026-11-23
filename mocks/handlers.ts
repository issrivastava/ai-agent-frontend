import { runHandlers } from './run-handlers';
import { workflowHandlers } from './workflow-handlers';

// Everything except these two now comes from the real backend.
export const handlers = [...workflowHandlers, ...runHandlers];