'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Bell, Check, CheckCircle2, RotateCcw, ShieldAlert, XCircle } from 'lucide-react';
import { useRuns } from '@/hooks/useRun';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const READ_KEY = 'agent-platform:notifications-read';

type Notice = {
  id: string;
  kind: 'approval' | 'failure';
  title: string;
  subtitle: string;
  href: string;
  timestamp: string;
};

// localStorage can't be read during SSR, so read-id state goes through
// useSyncExternalStore: server snapshot is empty, client snapshot is localStorage.
const EMPTY_IDS: string[] = [];
const listeners = new Set<() => void>();
let cachedRead: string[] | null = null;

function getReadIds(): string[] {
  if (cachedRead) return cachedRead;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(READ_KEY) ?? '[]');
    cachedRead = Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    cachedRead = [];
  }
  return cachedRead;
}

function getServerReadIds(): string[] {
  return EMPTY_IDS;
}

function writeReadIds(next: string[]) {
  cachedRead = next;
  try {
    // Cap the list so it never grows without bound.
    window.localStorage.setItem(READ_KEY, JSON.stringify(next.slice(-200)));
  } catch {
    // Private mode / quota — keep the in-memory value.
  }
  for (const listener of listeners) listener();
}

function subscribeReadIds(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === READ_KEY || event.key === null) {
      cachedRead = null;
      callback();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export function NotificationsBell() {
  const { data, isLoading, isError, refetch } = useRuns();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const readIds = useSyncExternalStore(subscribeReadIds, getReadIds, getServerReadIds);

  const notices = useMemo<Notice[]>(() => {
    const runs = data ?? [];
    const approvals: Notice[] = runs
      .filter((run) => run.status === 'waiting_approval')
      .map((run) => ({
        id: `${run.id}:approval`,
        kind: 'approval',
        title: run.workflowName,
        subtitle: `${run.id} · waiting for your approval`,
        href: `/runs/${run.id}`,
        timestamp: run.startedAt,
      }));
    const failures: Notice[] = runs
      .filter((run) => run.status === 'failed')
      .map((run) => ({
        id: `${run.id}:failed`,
        kind: 'failure',
        title: run.workflowName,
        subtitle: `${run.id} · run failed`,
        href: `/runs/${run.id}`,
        timestamp: run.finishedAt ?? run.startedAt,
      }));
    return [...approvals, ...failures].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [data]);

  const isRead = (id: string) => readIds.includes(id);
  const unreadCount = notices.filter((n) => !isRead(n.id)).length;

  const markRead = (id: string) => {
    if (readIds.includes(id)) return;
    writeReadIds([...readIds, id]);
  };

  const markAllRead = () => {
    writeReadIds([...readIds, ...notices.map((n) => n.id)]);
  };

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

  const groups = [
    { label: 'Today', items: notices.filter((n) => isToday(n.timestamp)) },
    { label: 'Earlier', items: notices.filter((n) => !isToday(n.timestamp)) },
  ].filter((group) => group.items.length > 0);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-tour="notifications"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : notices.length > 0
              ? `Notifications, ${notices.length} items`
              : 'Notifications'
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className="relative flex size-8 items-center justify-center rounded-md transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white ring-2 ring-card">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl"
        >
          <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
            <p className="text-sm font-medium">Notifications</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Check className="size-3" />
                Mark all read
              </button>
            ) : notices.length > 0 ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                All read
              </span>
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-2 p-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-7 shrink-0 rounded-md" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <XCircle className="size-8 text-destructive" />
              <p className="text-sm font-medium">Could not load notifications</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-1 hover:underline"
              >
                <RotateCcw className="size-3.5" />
                Try again
              </button>
            </div>
          ) : notices.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 px-4 py-8 text-center">
              <CheckCircle2 className="size-8 text-emerald-500" />
              <p className="text-sm font-medium">You&apos;re all caught up</p>
              <p className="text-xs text-muted-foreground">
                Approvals and failed runs will show up here.
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto p-1">
              {groups.map((group) => (
                <div key={group.label} className="mb-1 last:mb-0">
                  <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {group.label}
                  </p>
                  {group.items.map((notice) => {
                    const read = isRead(notice.id);
                    const approval = notice.kind === 'approval';
                    return (
                      <Link
                        key={notice.id}
                        href={notice.href}
                        onClick={() => markRead(notice.id)}
                        className={cn(
                          'flex items-start gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted',
                          !read && 'bg-muted/50',
                        )}
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md',
                            approval
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-destructive/10 text-destructive',
                          )}
                        >
                          {approval ? (
                            <ShieldAlert className="size-3.5" />
                          ) : (
                            <XCircle className="size-3.5" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 text-sm">
                          <span className={cn('block truncate', read && 'font-normal')}>
                            {notice.title}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {notice.subtitle}
                          </span>
                          <span className="block text-[10px] text-muted-foreground/80">
                            {relativeTime(notice.timestamp)}
                          </span>
                        </span>
                        {!read && (
                          <span
                            aria-label="Unread"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-1"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
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
