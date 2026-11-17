import { extractionHandlers } from './extraction-handlers';
import { runHandlers } from './run-handlers';
import { workflowHandlers } from './workflow-handlers';

// Tickets, auth, and users now come from the real backend, so they are not mocked.
export const handlers = [...workflowHandlers, ...runHandlers, ...extractionHandlers];