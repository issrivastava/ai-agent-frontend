import Link from 'next/link';
import { Suspense } from 'react';
import { Layers, Play, Plus, Wrench, Workflow } from 'lucide-react';
import { Can } from '@/components/auth/guards';
import { PageGuide } from '@/components/layout/page-guide';
import { PageHeader } from '@/components/layout/page-header';
import { TableContentSkeleton } from '@/components/shared/skeletons';
import { WorkflowsTable } from '@/components/workflows/workflows-table';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function WorkflowsPage() {
  return (
    <>
      <PageHeader
        icon={Workflow}
        title="Workflows"
        description="Reusable playbooks that chain agents, tools, and approval gates."
        actions={
          <Can permission="workflows:manage">
            <Link
              href="/workflows/new"
              className={cn(
                buttonVariants(),
                'bg-brand-gradient shadow-brand text-white hover:brightness-105',
              )}
            >
              <Plus className="size-4" />
              New workflow
            </Link>
          </Can>
        }
      />
      <PageGuide
        steps={[
          {
            icon: Layers,
            title: 'Compose ordered agents',
            description: 'Each agent has a role and a prompt; steps run from top to bottom.',
          },
          {
            icon: Wrench,
            title: 'Grant the least tools',
            description: 'Give each agent only the tools it truly needs to finish its job.',
          },
          {
            icon: Play,
            title: 'Activate and run',
            description: 'Only active workflows can start a run and create tickets or actions.',
          },
        ]}
      />
      <Suspense fallback={<TableContentSkeleton columns={5} />}>
        <WorkflowsTable />
      </Suspense>
    </>
  );
}
