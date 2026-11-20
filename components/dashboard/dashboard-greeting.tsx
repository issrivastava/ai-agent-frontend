'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Play, Ticket, UploadCloud } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardGreeting() {
  const { user, can } = useAuth();
  // Lazy initializer: read once on the client, never during prerender.
  const [now] = useState(() => new Date());

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {greetingFor(now.getHours())}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · Here&apos;s
          what your agents are doing.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {can('workflows:run') && (
          <Link href="/workflows" className={cn(buttonVariants({ size: 'sm' }))}>
            <Play className="size-3.5" />
            Run a workflow
          </Link>
        )}
        {can('extractions:upload') && (
          <Link href="/extractions" className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
            <UploadCloud className="size-3.5" />
            Upload document
          </Link>
        )}
        <Link href="/tickets" className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
          <Ticket className="size-3.5" />
          View tickets
        </Link>
      </div>
    </div>
  );
}