import { CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';

const icons = {
  completed: <CheckCircle2 className="size-5 text-green-600" />,
  waiting_approval: <ShieldAlert className="size-5 text-amber-600" />,
  pending: <Clock className="size-5 text-muted-foreground" />,
};

const steps = [
  { agent: 'Triage agent', detail: 'Classified as a refund request, high priority', status: 'completed' },
  { agent: 'Billing agent', detail: 'Wants to use refund_api for this customer', status: 'waiting_approval' },
  { agent: 'Dispatch agent', detail: 'Assign the ticket to the best available agent', status: 'pending' },
] as const;

export function ProductPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of a workflow run paused for human approval"
      className="rounded-xl border bg-card p-5 shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Support ticket triage</p>
          <p className="text-xs text-muted-foreground">RUN-104 · example run</p>
        </div>
        <StatusBadge status="waiting_approval" />
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 rounded-full bg-primary" />
      </div>

      <ol className="mt-5 space-y-4">
        {steps.map((step) => (
          <li key={step.agent} className="flex gap-3">
            <span className="mt-0.5">{icons[step.status]}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{step.agent}</p>
                <StatusBadge status={step.status} />
              </div>
              <p className="text-sm text-muted-foreground">{step.detail}</p>
              {step.status === 'waiting_approval' && (
                <div className="mt-3 flex gap-2">
                  <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                    Approve
                  </span>
                  <span className="rounded-md border px-3 py-1.5 text-xs font-medium">Reject</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}