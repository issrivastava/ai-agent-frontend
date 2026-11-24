'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ShieldAlert } from 'lucide-react';
import { navGroups, navItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useRuns } from '@/hooks/useRun';
import { useUiStore } from '@/lib/ui-store';

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { can } = useAuth();
  const setHelpOpen = useUiStore((s) => s.setHelpOpen);
  const { data: runs } = useRuns();

  const pendingApprovals = runs?.filter((run) => run.status === 'waiting_approval').length ?? 0;

  return (
    <nav className="flex h-full flex-col p-3" aria-label="Workspace navigation">
      <div className="flex-1 space-y-5">
        {navGroups.map((group) => {
          const items = navItems.filter(
            (item) => item.group === group && (!item.permission || can(item.permission)),
          );
          if (items.length === 0) return null;

          return (
            <div key={group}>
              <p className="px-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground/80 uppercase">
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                        active
                          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'bg-brand-gradient absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full transition-opacity',
                          active ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <Icon
                        className={cn(
                          'size-4 shrink-0 transition-colors',
                          active
                            ? 'text-brand-1'
                            : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      />
                      <span className="flex-1">{label}</span>
                      {href === '/runs' && pendingApprovals > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          <ShieldAlert className="size-2.5" />
                          {pendingApprovals}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t pt-3">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            setHelpOpen(true);
          }}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <BookOpen className="size-4 shrink-0" />
          <span className="flex-1 text-left">Platform guide</span>
          <span className="rounded border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ?
          </span>
        </button>
      </div>
    </nav>
  );
}
