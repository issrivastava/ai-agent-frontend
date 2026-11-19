'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/shared/data-table';
import { useUpdateUserRole, useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/providers/auth-provider';
import { roles, type Role, type User } from '@/types/user';

const selectClass =
  'h-8 rounded-md border border-input bg-background px-2 text-sm capitalize outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50';

export function UsersTable() {
  const { user: me } = useAuth();
  const { data, isLoading, isError, refetch } = useUsers();
  const update = useUpdateUserRole();
  const pendingId = update.isPending ? update.variables.id : undefined;

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.name}
            {row.original.id === me.id && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
          </span>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'role',
        header: ({ column }) => <SortableHeader column={column} title="Role" />,
        cell: ({ row }) => (
          <select
            aria-label={`Role for ${row.original.name}`}
            className={selectClass}
            value={row.original.role}
            disabled={row.original.id === me.id || pendingId === row.original.id}
            onChange={(e) => update.mutate({ id: row.original.id, role: e.target.value as Role })}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [me.id, pendingId],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      searchPlaceholder="Search users…"
      emptyTitle="No users"
    />
  );
}