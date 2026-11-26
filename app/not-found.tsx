import Link from 'next/link';
import { ArrowLeft, Compass, LayoutDashboard, SearchX } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand-soft blur-3xl"
      />

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <Logo />
        <span className="mt-10 flex size-14 items-center justify-center rounded-2xl border bg-card text-brand-1 shadow-sm">
          <SearchX className="size-6" />
        </span>
        <p className="mt-5 text-[11px] font-semibold tracking-[0.2em] text-brand-1 uppercase">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          This page drifted out of the workflow.
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The link may be outdated, or the page never existed. Your dashboard and runs are still
          right where you left them.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants(),
              'bg-brand-gradient shadow-brand text-white hover:brightness-105',
            )}
          >
            <LayoutDashboard className="size-4" />
            Go to dashboard
          </Link>
          <Link href="/" className={buttonVariants({ variant: 'outline' })}>
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <Compass className="size-3.5" />
          <span>Looking for something else?</span>
          <Link
            href="/workflows"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Workflows
          </Link>
          <span aria-hidden>·</span>
          <Link
            href="/runs"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Agent runs
          </Link>
        </div>
      </div>
    </div>
  );
}
