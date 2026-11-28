import { Suspense } from 'react';
import { Activity, CheckCheck, ShieldCheck, Workflow } from 'lucide-react';
import { PageGuide } from '@/components/layout/page-guide';
import { PageHeader } from '@/components/layout/page-header';
import { RunsTable } from '@/components/runs/runs-table';
import { TableContentSkeleton } from '@/components/shared/skeletons';

export default function RunsPage() {
  return (
    <>
      <PageHeader
        icon={Activity}
        title="Agent runs"
        description="Every workflow execution, step, tool call, and human decision."
      />
      <PageGuide
        steps={[
          {
            icon: Workflow,
            title: 'A workflow becomes a run',
            description: 'Each run executes the agents in order, passing context forward.',
          },
          {
            icon: CheckCheck,
            title: 'Every step is logged',
            description: 'Open a run to see tools used, durations, and each agent output.',
          },
          {
            icon: ShieldCheck,
            title: 'You make the risky calls',
            description: 'Steps that touch money or customer data pause for your approval.',
          },
        ]}
      />
      <Suspense fallback={<TableContentSkeleton columns={6} />}>
        <RunsTable />
      </Suspense>
    </>
  );
}
