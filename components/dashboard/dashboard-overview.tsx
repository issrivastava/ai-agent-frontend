'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
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
import { KpiCard } from './kpi-card';
import { RunsPerDayChart } from './runs-per-day-chart';
import { TicketsByStatusChart } from './tickets-by-status-chart';

function ChartCard({ title, loading, children }: { title: string; loading: boolean; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{loading ? <Skeleton className="h-64 w-full" /> : children}</CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const tickets = useTickets({});
  const runs = useRuns();
  const extractions = useExtractions();
  const workflows = useWorkflows();

  const t = tickets.data ? ticketStats(tickets.data) : null;
  const r = runs.data ? runStats(runs.data) : null;
  const e = extractions.data ? extractionStats(extractions.data) : null;
  const activeWorkflows = workflows.data?.filter((w) => w.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Open tickets"
          loading={tickets.isLoading}
          value={t?.open ?? null}
          hint={t ? `${t.urgentOpen} urgent · ${t.total} total` : undefined}
        />
        <KpiCard
          label="Active agent runs"
          loading={runs.isLoading}
          value={r?.active ?? null}
          hint={r ? `${r.awaitingApproval.length} awaiting approval` : undefined}
        />
        <KpiCard
          label="Run success rate"
          loading={runs.isLoading}
          value={r?.successRate != null ? `${r.successRate}%` : null}
          hint={r?.avgSeconds != null ? `Avg. duration ${r.avgSeconds}s` : 'No finished runs yet'}
        />
        <KpiCard
          label="Documents extracted"
          loading={extractions.isLoading}
          value={e?.completed ?? null}
          hint={
            e
              ? `${e.inProgress} in progress${e.successRate != null ? ` · ${e.successRate}% success` : ''}`
              : undefined
          }
        />
      </div>

      {r && r.awaitingApproval.length > 0 && (
        <Card className="border-amber-300 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="size-4 text-amber-600" />
              Needs your approval
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {r.awaitingApproval.map((run) => (
              <div key={run.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  <span className="font-medium">{run.id}</span> · {run.workflowName}
                </span>
                <Link href={`/runs/${run.id}`} className={cn(buttonVariants({ size: 'sm' }))}>
                  Review
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Tickets by status" loading={tickets.isLoading}>
          {t && <TicketsByStatusChart data={t.byStatus} />}
        </ChartCard>
        <ChartCard title="Runs per day" loading={runs.isLoading}>
          {r && r.perDay.length > 0 ? (
            <RunsPerDayChart data={r.perDay} />
          ) : (
            <p className="py-24 text-center text-sm text-muted-foreground">No runs yet.</p>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent runs</CardTitle>
            <Link href="/runs" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {runs.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : r && r.recent.length > 0 ? (
              <ul className="divide-y">
                {r.recent.map((run) => (
                  <li key={run.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <Link href={`/runs/${run.id}`} className="min-w-0 truncate hover:underline">
                      <span className="font-medium">{run.id}</span> · {run.workflowName}
                    </Link>
                    <StatusBadge status={run.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No runs yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <p className="text-3xl font-semibold">{activeWorkflows ?? '—'}</p>
                <p className="text-xs text-muted-foreground">
                  active of {workflows.data?.length ?? 0} workflows
                </p>
                <Link href="/workflows" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                  Manage workflows
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}