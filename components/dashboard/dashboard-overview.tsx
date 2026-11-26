'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  FileSearch,
  Inbox,
  Play,
  ShieldAlert,
  Ticket,
  TrendingUp,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useExtractions } from '@/hooks/useExtractions';
import { useRuns } from '@/hooks/useRun';
import { useTickets } from '@/hooks/useTickets';
import { useWorkflows } from '@/hooks/useWorkflows';
import { extractionStats, runStats, ticketStats } from '@/lib/dashboard';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { KpiCard } from './kpi-card';
import { OnboardingChecklist } from './onboarding-checklist';
import { RunsPerDayChart } from './runs-per-day-chart';
import { TicketPriorityBreakdown } from './ticket-priority-breakdown';
import { TicketsByStatusChart } from './tickets-by-status-chart';

function ChartCard({
  title,
  description,
  icon: Icon,
  loading,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand-1">
              <Icon className="size-3.5" />
            </span>
            {title}
          </CardTitle>
          {description && <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-1">
        {loading ? <Skeleton className="h-56 w-full" /> : children}
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const { can } = useAuth();
  const tickets = useTickets({});
  const runs = useRuns();
  const extractions = useExtractions();
  const workflows = useWorkflows();

  const t = tickets.data ? ticketStats(tickets.data) : null;
  const r = runs.data ? runStats(runs.data) : null;
  const e = extractions.data ? extractionStats(extractions.data) : null;
  const activeWorkflows = workflows.data?.filter((w) => w.status === 'active').length;
  const pausedWorkflows = workflows.data?.filter((w) => w.status === 'paused').length;
  const draftWorkflows = workflows.data?.filter((w) => w.status === 'draft').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Open tickets"
          loading={tickets.isLoading}
          value={t?.open ?? null}
          hint={t ? `${t.urgentOpen} urgent · ${t.total} total` : undefined}
          icon={Ticket}
          tone="brand"
          href="/tickets"
        />
        <KpiCard
          label="Active agent runs"
          loading={runs.isLoading}
          value={r?.active ?? null}
          hint={r ? `${r.awaitingApproval.length} awaiting approval` : undefined}
          icon={Activity}
          tone="sky"
          href="/runs"
        />
        <KpiCard
          label="Run success rate"
          loading={runs.isLoading}
          value={r?.successRate != null ? `${r.successRate}%` : null}
          hint={
            r?.avgSeconds != null
              ? `Avg. duration ${r.avgSeconds}s · ${r.total} runs`
              : 'No finished runs yet'
          }
          icon={TrendingUp}
          tone="emerald"
          href="/runs"
        />
        <KpiCard
          label="Documents extracted"
          loading={extractions.isLoading}
          value={e?.completed ?? null}
          hint={e ? `${e.fieldsExtracted} fields · ${e.inProgress} processing` : undefined}
          icon={FileSearch}
          tone="amber"
          href="/extractions"
        />
      </div>

      {r && r.awaitingApproval.length > 0 && (
        <Card className="relative overflow-hidden border-amber-300/80 bg-linear-to-br from-amber-50 to-card dark:border-amber-800/70 dark:from-amber-950/30">
          <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-amber-400" />
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="size-4" />
              </span>
              Needs your approval
            </CardTitle>
            <Link
              href="/runs"
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              All runs
              <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {r.awaitingApproval.map((run) => (
              <div
                key={run.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card/80 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{run.workflowName}</p>
                  <p className="text-xs text-muted-foreground">
                    {run.id} · paused on a step that changes customer data
                  </p>
                </div>
                <Link
                  href={`/runs/${run.id}`}
                  className={cn(
                    buttonVariants({ size: 'sm' }),
                    'bg-amber-600 text-white hover:bg-amber-600/90',
                  )}
                >
                  Review
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Tickets by status"
          description="Every request currently in the support queue."
          icon={Ticket}
          loading={tickets.isLoading}
          action={
            <Link
              href="/tickets"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
            >
              View tickets
              <ArrowUpRight className="size-3.5" />
            </Link>
          }
        >
          {t && <TicketsByStatusChart data={t.byStatus} />}
        </ChartCard>

        <OnboardingChecklist />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Runs per day"
          description="Completed, in-progress, and failed workflow runs."
          icon={Activity}
          loading={runs.isLoading}
          action={
            <Link
              href="/runs"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
            >
              Run history
              <ArrowUpRight className="size-3.5" />
            </Link>
          }
        >
          {r && r.perDay.length > 0 ? (
            <RunsPerDayChart data={r.perDay} />
          ) : (
            <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
              <Inbox className="size-8 text-muted-foreground/60" />
              <p className="text-sm font-medium">No runs yet</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Start a workflow and its execution history will appear here.
              </p>
              {can('workflows:run') && (
                <Link href="/workflows" className={cn(buttonVariants({ size: 'sm' }), 'mt-1')}>
                  <Play className="size-3.5" />
                  Go to workflows
                </Link>
              )}
            </div>
          )}
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand-1">
                <TrendingUp className="size-3.5" />
              </span>
              Priority mix
            </CardTitle>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Where the queue needs attention right now.
            </p>
          </CardHeader>
          <CardContent>
            {tickets.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : t ? (
              <TicketPriorityBreakdown data={t.byPriority} />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent runs</CardTitle>
            <Link
              href="/runs"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1')}
            >
              View all
              <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {runs.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : r && r.recent.length > 0 ? (
              <ul className="divide-y">
                {r.recent.map((run) => {
                  const done = run.steps.filter((step) => step.status === 'completed').length;
                  return (
                    <li key={run.id}>
                      <Link
                        href={`/runs/${run.id}`}
                        className="group flex items-center gap-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-brand-soft group-hover:text-brand-1">
                          <Activity className="size-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{run.workflowName}</span>
                          <span className="block text-[11px] text-muted-foreground">
                            {run.id} · {done}/{run.steps.length} steps ·{' '}
                            {new Date(run.startedAt).toLocaleString('en-IN')}
                          </span>
                        </span>
                        <StatusBadge status={run.status} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No runs yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand-1">
                <WorkflowIcon className="size-3.5" />
              </span>
              Workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflows.isLoading ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              <>
                <div>
                  <p className="text-3xl font-semibold tracking-tight">{activeWorkflows ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">
                    active of {workflows.data?.length ?? 0} workflows
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-muted/60 px-2.5 py-2">
                    <p className="font-medium">{pausedWorkflows ?? 0}</p>
                    <p className="text-[11px] text-muted-foreground">paused</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 px-2.5 py-2">
                    <p className="font-medium">{draftWorkflows ?? 0}</p>
                    <p className="text-[11px] text-muted-foreground">drafts</p>
                  </div>
                </div>
                <Link
                  href="/workflows"
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full gap-1')}
                >
                  Manage workflows
                  <ArrowRight className="size-3" />
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
