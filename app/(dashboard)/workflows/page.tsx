import Link from 'next/link';
import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { WorkflowsTable } from '@/components/workflows/workflows-table';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function WorkflowsPage() {
  return (
    <>
      <PageHeader
        title="Workflows"
        description="Multi-agent workflows for ticket dispatch and data extraction."
        actions={
          <Link href="/workflows/new" className={cn(buttonVariants())}>
            <Plus className="size-4" />
            New workflow
          </Link>
        }
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <WorkflowsTable />
      </Suspense>
    </>
  );
}