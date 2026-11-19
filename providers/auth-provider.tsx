'use client';

import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ErrorState } from '@/components/shared/error-state';
import { api } from '@/lib/api';
import { hasPermission, type Permission } from '@/lib/permissions';
import type { User } from '@/types/user';

type AuthContextValue = { user: User; can: (permission: Permission) => boolean };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get<{ user: User }>('/auth/me')).data.user,
    retry: false,
    staleTime: 5 * 60_000,
  });

  const value = useMemo<AuthContextValue | null>(
    () => (data ? { user: data, can: (p) => hasPermission(data.role, p) } : null),
    [data],
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // A 401 is redirected to /login by the axios interceptor; anything else lands here.
  if (!value) {
    return (
      <ErrorState
        title="Could not verify your session"
        message="Check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}