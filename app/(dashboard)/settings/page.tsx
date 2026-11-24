import { Suspense } from 'react';
import { KeyRound, Settings, ShieldCheck, Users } from 'lucide-react';
import { RequirePermission } from '@/components/auth/guards';
import { PageGuide } from '@/components/layout/page-guide';
import { PageHeader } from '@/components/layout/page-header';
import { UsersTable } from '@/components/settings/users-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Manage who can do what on this platform."
      />
      <PageGuide
        steps={[
          {
            icon: Users,
            title: 'Invite your team',
            description: 'Every person gets a named account and exactly one role.',
          },
          {
            icon: KeyRound,
            title: 'Roles set permissions',
            description: 'Admins manage, agents operate, and viewers get read-only access.',
          },
          {
            icon: ShieldCheck,
            title: 'Changes apply immediately',
            description: 'Menus and actions re-check permissions on every request.',
          },
        ]}
      />
      <RequirePermission permission="users:manage">
        <Suspense fallback={<Skeleton className="h-72 w-full" />}>
          <UsersTable />
        </Suspense>
      </RequirePermission>
    </>
  );
}
