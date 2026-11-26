'use client';

import { LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { useAuth } from '@/providers/auth-provider';

export function SidebarUser() {
  const { user } = useAuth();
  const logout = useLogout();

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-3 rounded-lg bg-card/70 p-2 ring-1 ring-border/60">
        <div className="bg-brand-gradient shadow-brand flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-[11px] text-muted-foreground capitalize">
            {user.role} · {user.email}
          </p>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
          className="rounded-md p-2 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}
