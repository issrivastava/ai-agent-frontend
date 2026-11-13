'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, Loader2, ShieldAlert, XCircle } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRun, useRunDecision } from '@/hooks/useRun';
import { cn } from '@/lib/utils';
import type { RunStep, StepStatus } from '@/types/run';

const stepIcon = {
  pending: <Clock className="size-5 text-muted-foreground" />,
  running: <Loader2 className="size-5 animate-spin text-blue-600" />,
  waiting_approval: <ShieldAlert className="size-5 text-amber-600" />,
  completed: <CheckCircle2 className="size-5 text-green-600" />,
  failed: <XCircle className="size-5 text-destructive" />,
} satisfies Record<StepStatus, React.ReactNode>;

function StepCard({
  step,
  index,
  isLast,
  deciding,
  onApprove,
  onReject,
}: {
  step: RunStep;
  index: number;
  isLast: boolean;
  deciding: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-1">{stepIcon[step.status]}</div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>

      <Card className={cn('mb-4 flex-1', step.status === 'pending' && 'opacity-60')}>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">
              Step {index + 1}: <span className="capitalize">{step.agent}</span> agent
            </p>
            <div className="flex items-center gap-2">
              {step.durationMs !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {(step.durationMs / 1000).toFixed(1)}s
                </span>
              )}
              <StatusBadge status={step.status} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{step.action}</p>
          {step.tool && (
            <p className="text-xs">
              Tool: <code className="rounded bg-muted px-1.5 py-0.5">{step.tool}</code>
            </p>
          )}
          {step.output && <p className="rounded-md bg-muted p-2 text-sm">{step.output}</p>}

          {step.status === 'waiting_approval' && (
            <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
              <p className="text-sm">
                This step wants to use <strong>{step.tool}</strong>, which can change customer data.
                Approve to continue, or reject to stop the run.
              </p>
              <div className="flex gap-2">
                <Button size="sm" disabled={deciding} onClick={onApprove}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" disabled={deciding} onClick={onReject}>
                  Reject
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function RunViewer({ id }: { id: string }) {
  const { data: run, isLoading, isError, refetch } = useRun(id);
  const decide = useRunDecision(id);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !run) {
    return (
      <ErrorState
        title="Run not found"
        message="It may have been cleared by a page refresh, since mock runs live in memory."
        onRetry={() => refetch()}
      />
    );
  }

  const done = run.steps.filter((s) => s.status === 'completed').length;
  const percent = Math.round((done / run.steps.length) * 100);
  const live = run.status === 'running' || run.status === 'waiting_approval';

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{run.workflowName}</p>
              <p className="text-xs text-muted-foreground">
                {run.id} · started {new Date(run.startedAt).toLocaleTimeString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {live && <span className="text-xs text-muted-foreground">Updating live…</span>}
              <StatusBadge status={run.status} />
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full transition-all',
                run.status === 'failed' ? 'bg-destructive' : 'bg-primary',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {done} of {run.steps.length} steps completed
          </p>
        </CardContent>
      </Card>

      <div>
        {run.steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            isLast={i === run.steps.length - 1}
            deciding={decide.isPending}
            onApprove={() => decide.mutate('approved')}
            onReject={() => setRejectOpen(true)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject this step?"
        description="The run will stop here and be marked as failed."
        confirmLabel="Reject and stop"
        destructive
        loading={decide.isPending}
        onConfirm={() => decide.mutate('rejected', { onSuccess: () => setRejectOpen(false) })}
      />
    </div>
  );
}