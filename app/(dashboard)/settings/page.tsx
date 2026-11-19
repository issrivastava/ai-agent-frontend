import { Suspense } from 'react';
import { RequirePermission } from '@/components/auth/guards';
import { PageHeader } from '@/components/layout/page-header';
import { UsersTable } from '@/components/settings/users-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage who can do what on this platform." />
      <RequirePermission permission="users:manage">
        <Suspense fallback={<Skeleton className="h-72 w-full" />}>
          <UsersTable />
        </Suspense>
      </RequirePermission>
    </>
  );
}