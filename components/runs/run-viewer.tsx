'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ListChecks,
  Loader2,
  ShieldAlert,
  Wrench,
  XCircle,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRun, useRunDecision } from '@/hooks/useRun';
import { cn } from '@/lib/utils';
import type { Run, RunStep, StepStatus } from '@/types/run';

const stepMeta: Record<StepStatus, { icon: React.ReactNode; tone: string }> = {
  pending: {
    icon: <Clock className="size-4" />,
    tone: 'bg-muted text-muted-foreground border-border',
  },
  running: {
    icon: <Loader2 className="size-4 animate-spin" />,
    tone: 'bg-sky-500/10 text-sky-600 border-sky-200 dark:border-sky-900 dark:text-sky-400',
  },
  waiting_approval: {
    icon: <ShieldAlert className="size-4" />,
    tone: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900 dark:text-amber-400',
  },
  completed: {
    icon: <CheckCircle2 className="size-4" />,
    tone: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900 dark:text-emerald-400',
  },
  failed: {
    icon: <XCircle className="size-4" />,
    tone: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

function formatDuration(run: Run) {
  if (!run.finishedAt) return 'Live';
  const seconds = Math.round(
    (new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000,
  );
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

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
  const meta = stepMeta[step.status];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'mt-4 flex size-9 shrink-0 items-center justify-center rounded-full border shadow-sm',
            meta.tone,
          )}
        >
          {meta.icon}
        </span>
        {!isLast && <div className="my-1 w-px flex-1 bg-border" />}
      </div>

      <Card className={cn('mb-4 flex-1', step.status === 'pending' && 'opacity-65')}>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <p className="text-sm font-medium capitalize">
                {step.agent} <span className="font-normal text-muted-foreground">agent</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {step.durationMs !== undefined && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  {(step.durationMs / 1000).toFixed(1)}s
                </span>
              )}
              <StatusBadge status={step.status} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{step.action}</p>

          <div className="flex flex-wrap items-center gap-2">
            {step.tool && (
              <span className="inline-flex items-center gap-1.5 rounded-md border bg-muted/60 px-2 py-1 text-[11px] font-medium">
                <Wrench className="size-3 text-brand-1" />
                {step.tool}
              </span>
            )}
            {step.requiresApproval && (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                <ShieldAlert className="size-3" />
                Approval gate
              </span>
            )}
            {step.approval && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium capitalize',
                  step.approval === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'bg-destructive/10 text-destructive',
                )}
              >
                {step.approval}
              </span>
            )}
          </div>

          {step.output && (
            <p className="rounded-lg border bg-muted/40 p-2.5 text-sm leading-relaxed whitespace-pre-wrap">
              {step.output}
            </p>
          )}

          {step.status === 'waiting_approval' && (
            <div className="space-y-2.5 rounded-xl border border-amber-300 bg-linear-to-br from-amber-50 to-card p-3 dark:border-amber-800 dark:from-amber-950/40">
              <div className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm">
                  This step wants to use{' '}
                  <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">{step.tool}</code>
                  , which can change customer data. Approve to continue, or reject to stop the run.
                </p>
              </div>
              <div className="flex gap-2 pl-6">
                <Button
                  size="sm"
                  disabled={deciding}
                  onClick={onApprove}
                  className="bg-emerald-600 text-white hover:bg-emerald-600/90"
                >
                  {deciding ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                  Approve
                </Button>
                <Button size="sm" variant="outline" disabled={deciding} onClick={onReject}>
                  <XCircle className="size-3.5" />
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
  const percent = run.steps.length ? Math.round((done / run.steps.length) * 100) : 0;
  const live = run.status === 'running' || run.status === 'waiting_approval';
  const toolsUsed = new Set(run.steps.map((step) => step.tool).filter(Boolean)).size;

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/runs"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-3 gap-1.5')}
      >
        <ArrowLeft className="size-4" />
        All runs
      </Link>

      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className={cn(
            'absolute inset-x-0 top-0 h-1',
            run.status === 'failed' ? 'bg-destructive' : 'bg-brand-gradient',
          )}
        />
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-base font-semibold">{run.workflowName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {run.id} · started {new Date(run.startedAt).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {live && (
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Updating live
                </span>
              )}
              <StatusBadge status={run.status} />
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                run.status === 'failed' ? 'bg-destructive' : 'bg-brand-gradient',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border bg-muted/30 px-2 py-2">
              <p className="flex items-center justify-center gap-1 text-sm font-semibold">
                <ListChecks className="size-3.5 text-brand-1" />
                {done}/{run.steps.length}
              </p>
              <p className="text-[10px] text-muted-foreground">steps completed</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-2 py-2">
              <p className="flex items-center justify-center gap-1 text-sm font-semibold">
                <Wrench className="size-3.5 text-brand-1" />
                {toolsUsed}
              </p>
              <p className="text-[10px] text-muted-foreground">tools used</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-2 py-2">
              <p className="flex items-center justify-center gap-1 text-sm font-semibold">
                <Clock className="size-3.5 text-brand-1" />
                {formatDuration(run)}
              </p>
              <p className="text-[10px] text-muted-foreground">duration</p>
            </div>
          </div>
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
