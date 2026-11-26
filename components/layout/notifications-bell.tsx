'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useRuns } from '@/hooks/useRun';

export function NotificationsBell() {
  const { data } = useRuns();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pending = data?.filter((run) => run.status === 'waiting_approval') ?? [];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={
          pending.length ? `Notifications, ${pending.length} waiting for approval` : 'Notifications'
        }
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative flex size-8 items-center justify-center rounded-md transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Bell className="size-4" />
        {pending.length > 0 && (
          <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white ring-2 ring-card">
            {pending.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl">
          <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
            <p className="text-sm font-medium">Needs your approval</p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              {pending.length} pending
            </span>
          </div>

          {pending.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 px-4 py-8 text-center">
              <CheckCircle2 className="size-8 text-emerald-500" />
              <p className="text-sm font-medium">You&apos;re all caught up</p>
              <p className="text-xs text-muted-foreground">
                Runs that pause for a human will appear here.
              </p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto p-1">
              {pending.map((run) => (
                <Link
                  key={run.id}
                  href={`/runs/${run.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                    <ShieldAlert className="size-3.5" />
                  </span>
                  <span className="min-w-0 text-sm">
                    <span className="block truncate font-medium">{run.workflowName}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {run.id} · waiting for review
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/runs"
            onClick={() => setOpen(false)}
            className="block border-t bg-muted/40 px-3 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all agent runs
          </Link>
        </div>
      )}
    </div>
  );
}
