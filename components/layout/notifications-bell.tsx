'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bell, ShieldAlert } from 'lucide-react';
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
        aria-label={pending.length ? `Notifications, ${pending.length} waiting for approval` : 'Notifications'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative flex size-9 items-center justify-center rounded-md outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Bell className="size-4" />
        {pending.length > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
            {pending.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <p className="px-3 py-2 text-sm font-medium">Needs your approval</p>
          {pending.length === 0 ? (
            <p className="px-3 pb-3 text-sm text-muted-foreground">You&apos;re all caught up.</p>
          ) : (
            pending.map((run) => (
              <Link
                key={run.id}
                href={`/runs/${run.id}`}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 rounded-sm px-3 py-2 hover:bg-muted"
              >
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <span className="min-w-0 text-sm">
                  <span className="block truncate font-medium">{run.workflowName}</span>
                  <span className="text-xs text-muted-foreground">{run.id} · waiting for review</span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}