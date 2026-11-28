import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Page header block: icon tile, title, and description lines. */
function HeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Skeleton className="size-10 shrink-0 rounded-xl" />
      <div className="w-full space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
    </div>
  );
}

/** Toolbar row: search box plus filter chips. */
function ToolbarSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Skeleton className="h-8 w-full max-w-sm" />
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24" />
      ))}
    </div>
  );
}

/** Toolbar + table body + pagination — use when the page header is already rendered. */
export function TableContentSkeleton({
  columns = 6,
  rows = 6,
  filters = 2,
  className,
}: {
  columns?: number;
  rows?: number;
  filters?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <ToolbarSkeleton count={filters} />
      <div className="overflow-hidden rounded-md border">
        <div className="flex gap-4 border-b bg-muted/40 px-4 py-2.5">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 flex-1" />
          ))}
        </div>
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 px-4 py-3">
              {Array.from({ length: columns }).map((_, c) => (
                <Skeleton
                  key={c}
                  className={cn(
                    'h-4 flex-1',
                    c === 0 && 'max-w-40',
                    c === columns - 1 && 'max-w-16',
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  );
}

/** Table page: header + toolbar + a table's worth of rows. */
export function TablePageSkeleton({
  columns = 6,
  rows = 6,
  filters = 2,
  className,
}: {
  columns?: number;
  rows?: number;
  filters?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <HeaderSkeleton />
      <TableContentSkeleton columns={columns} rows={rows} filters={filters} />
    </div>
  );
}

/** KPI row plus chart cards — the dashboard overview shape. */
export function StatGridSkeleton({ items = 4, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

/** Card grid fallback (workflows, use-case grids, settings cards). */
export function CardGridSkeleton({ cards = 4, className }: { cards?: number; className?: string }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card p-5">
          <Skeleton className="size-10 rounded-xl" />
          <Skeleton className="mt-4 h-3 w-16" />
          <Skeleton className="mt-2 h-4 w-32" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1.5 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/** Detail page: back/header block, meta pills, and stacked content cards. */
export function DetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('max-w-3xl space-y-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <HeaderSkeleton />
        <Skeleton className="h-8 w-24 shrink-0 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>
  );
}

/** Form page: labels and inputs stacked. */
export function FormSkeleton({ fields = 5, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn('max-w-2xl space-y-5', className)}>
      <HeaderSkeleton />
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}
