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
      <div className="flex items-center gap-3 rounded-md p-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p>
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