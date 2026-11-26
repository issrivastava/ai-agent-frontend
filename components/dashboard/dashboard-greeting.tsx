'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { ArrowRight, Play, ShieldCheck, Sparkles, Ticket, UploadCloud } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

const subscribeNoop = () => () => {};

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardGreeting() {
  const { user, can } = useAuth();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const now = mounted ? new Date() : null;
  const firstName = user.name.split(' ')[0];

  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_18rem_at_0%_-20%,color-mix(in_oklab,var(--brand-1)_14%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-brand-1 uppercase">
            <Sparkles className="size-3.5" />
            Workspace overview
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {now ? `${greetingFor(now.getHours())}, ` : 'Welcome back, '}
            {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {now
              ? `${now.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })} · Here's what your agents are doing.`
              : 'Here’s what your agents are doing.'}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {can('workflows:run') && (
              <Link
                href="/workflows"
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'bg-brand-gradient shadow-brand text-white hover:brightness-105',
                )}
              >
                <Play className="size-3.5" />
                Run a workflow
              </Link>
            )}
            {can('extractions:upload') && (
              <Link
                href="/extractions"
                className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'gap-1.5')}
              >
                <UploadCloud className="size-3.5" />
                Upload document
              </Link>
            )}
            <Link
              href="/tickets"
              className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }), 'gap-1.5')}
            >
              <Ticket className="size-3.5" />
              View tickets
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        <div className="hidden shrink-0 flex-col gap-2 sm:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Agents ready
          </span>
          <span className="flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand-1" />
            Risky steps need approval
          </span>
          <span className="flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-brand-1" />
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} access
          </span>
        </div>
      </div>
    </section>
  );
}
