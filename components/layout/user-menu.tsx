'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, KeyRound, LogOut, Settings } from 'lucide-react';
import { ChangePasswordDialog } from '@/components/auth/change-password-dialog';
import { useLogout } from '@/hooks/useAuth';
import { useUiStore } from '@/lib/ui-store';
import { useAuth } from '@/providers/auth-provider';

export function UserMenu() {
  const { user, can } = useAuth();
  const logout = useLogout();
  const setHelpOpen = useUiStore((s) => s.setHelpOpen);
  const [open, setOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full p-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className="bg-brand-gradient shadow-brand flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white">
          {initials}
        </span>
        <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl"
        >
          <div className="bg-brand-soft p-3">
            <div className="flex items-center gap-2.5">
              <span className="bg-brand-gradient flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <span className="mt-2 inline-flex items-center rounded-full border border-border/60 bg-card px-2 py-0.5 text-[10px] font-medium capitalize">
              Role: {user.role}
            </span>
          </div>

          <div className="p-1">
            {can('users:manage') && (
              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted"
              >
                <Settings className="size-4 text-muted-foreground" />
                Settings
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setPasswordOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted"
            >
              <KeyRound className="size-4 text-muted-foreground" />
              Change password
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setHelpOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted"
            >
              <BookOpen className="size-4 text-muted-foreground" />
              Platform guide
            </button>
            <div className="my-1 h-px bg-border" />
            <button
              type="button"
              role="menuitem"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <LogOut className="size-4" />
              {logout.isPending ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </div>
  );
}
