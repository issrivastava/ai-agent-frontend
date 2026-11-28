'use client';

import { Lock } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import type { Permission } from '@/lib/permissions';
import { useAuth } from '@/providers/auth-provider';

/** Renders children only if the user has the permission; renders nothing otherwise. */
export function Can({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const { can } = useAuth();
  return can(permission) ? <>{children}</> : null;
}

/** Protects a whole page, showing a message instead of the content. */
export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const { can } = useAuth();
  if (!can(permission)) {
    return (
      <EmptyState
        icon={Lock}
        title="You don't have access to this page"
        description="Ask an administrator to change your role."
      />
    );
  }
  return <>{children}</>;
}
