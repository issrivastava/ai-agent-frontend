import { Suspense } from 'react';
import { Bot, MousePointerClick, Repeat2, Ticket } from 'lucide-react';
import { PageGuide } from '@/components/layout/page-guide';
import { PageHeader } from '@/components/layout/page-header';
import { TicketsTable } from '@/components/tickets/tickets-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketsPage() {
  return (
    <>
      <PageHeader
        icon={Ticket}
        title="Tickets"
        description="The customer support queue your agents triage, resolve, and hand off."
      />
      <PageGuide
        steps={[
          {
            icon: Bot,
            title: 'Agents pick up new tickets',
            description: 'Triage reads the request, finds the customer, and suggests an owner.',
          },
          {
            icon: MousePointerClick,
            title: 'Open a row for full context',
            description: 'See status, priority, customer details, and the current owner.',
          },
          {
            icon: Repeat2,
            title: 'Reassign when needed',
            description: 'Move a ticket to another agent; every change is permission-checked.',
          },
        ]}
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TicketsTable />
      </Suspense>
    </>
  );
}
