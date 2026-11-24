import Link from 'next/link';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const tones = {
  brand: 'bg-brand-soft text-brand-1',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
} as const;

export function KpiCard({
  label,
  value,
  hint,
  loading,
  icon: Icon,
  tone = 'brand',
  href,
}: {
  label: string;
  value: string | number | null;
  hint?: string;
  loading?: boolean;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  href?: string;
}) {
  const body = (
    <Card className={cn('card-hover group relative h-full', href && 'cursor-pointer')}>
      <CardContent className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <span
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-xl',
              tones[tone],
            )}
          >
            <Icon className="size-4" />
          </span>
        </div>

        <div className="space-y-1">
          {loading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <p className="text-3xl font-semibold tracking-tight">{value ?? '—'}</p>
          )}
          {hint && !loading && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>

        {href && (
          <span className="absolute right-4 bottom-4 flex items-center gap-1 text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            View
            <ArrowUpRight className="size-3" />
          </span>
        )}
      </CardContent>
    </Card>
  );

  return href ? (
    <Link
      href={href}
      className="block h-full rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {body}
    </Link>
  ) : (
    body
  );
}
