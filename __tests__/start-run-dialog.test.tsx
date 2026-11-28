import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StartRunDialog } from '@/components/workflows/start-run-dialog';
import type { Workflow } from '@/types/workflow';

const { startMutate, ticketState } = vi.hoisted(() => ({
  startMutate: vi.fn(),
  ticketState: { data: [] as { id: string; subject: string; priority: string }[] },
}));

vi.mock('@/hooks/useStartRun', () => ({
  useStartRun: () => ({ mutate: startMutate, isPending: false }),
}));
vi.mock('@/hooks/useTickets', () => ({
  useTickets: () => ({ data: ticketState.data, isLoading: false }),
}));

const dispatchWorkflow: Workflow = {
  id: 'WF-001',
  name: 'Support ticket triage',
  description: '',
  type: 'dispatch',
  status: 'active',
  agents: [{ role: 'triage', prompt: 'Classify the ticket.', tools: ['ticket_lookup'] }],
  updatedAt: '2026-11-20T10:00:00.000Z',
};
const extractionWorkflow: Workflow = {
  ...dispatchWorkflow,
  id: 'WF-002',
  name: 'Invoice extraction',
  type: 'extraction',
};

describe('StartRunDialog', () => {
  beforeEach(() => {
    startMutate.mockClear();
    ticketState.data = [
      { id: 'TCK-1002', subject: 'Login problem', priority: 'medium' },
      { id: 'TCK-1001', subject: 'Refund not received', priority: 'high' },
    ];
  });

  it('lists open tickets for a dispatch workflow', () => {
    render(<StartRunDialog workflow={dispatchWorkflow} onClose={() => {}} />);

    expect(screen.getByLabelText('Ticket')).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /TCK-1001 · Refund not received/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /TCK-1002 · Login problem/ })).toBeInTheDocument();
  });

  it('starts the run with the first ticket by default', async () => {
    const user = userEvent.setup();
    render(<StartRunDialog workflow={dispatchWorkflow} onClose={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Start run' }));

    expect(startMutate).toHaveBeenCalledWith(
      { workflowId: 'WF-001', ticketId: 'TCK-1002' },
      expect.anything(),
    );
  });

  it('starts the run with the ticket the user picked', async () => {
    const user = userEvent.setup();
    render(<StartRunDialog workflow={dispatchWorkflow} onClose={() => {}} />);

    await user.selectOptions(screen.getByLabelText('Ticket'), 'TCK-1001');
    await user.click(screen.getByRole('button', { name: 'Start run' }));

    expect(startMutate).toHaveBeenCalledWith(
      { workflowId: 'WF-001', ticketId: 'TCK-1001' },
      expect.anything(),
    );
  });

  it('does not ask for a ticket on an extraction workflow', async () => {
    const user = userEvent.setup();
    render(<StartRunDialog workflow={extractionWorkflow} onClose={() => {}} />);

    expect(screen.queryByLabelText('Ticket')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start run' }));

    expect(startMutate).toHaveBeenCalledWith(
      { workflowId: 'WF-002', ticketId: undefined },
      expect.anything(),
    );
  });

  it('blocks starting when there are no open tickets', () => {
    ticketState.data = [];
    render(<StartRunDialog workflow={dispatchWorkflow} onClose={() => {}} />);

    expect(screen.getByText('There are no open tickets to work on.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start run' })).toBeDisabled();
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<StartRunDialog workflow={dispatchWorkflow} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });
});
