import { Check, CircleDashed, LucideIcon, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimelineStatus = 'done' | 'current' | 'attention' | 'upcoming';

export type TimelineItem = {
  id: string;
  label: string;
  description?: string;
  status: TimelineStatus;
  /** Rendered on the right of the row, e.g. a creation date. */
  timestamp?: string;
  icon?: LucideIcon;
};

const tone: Record<TimelineStatus, string> = {
  done: 'border-emerald-200 bg-emerald-500/10 text-emerald-600 dark:border-emerald-900 dark:text-emerald-400',
  current: 'border-brand-1/30 bg-brand-soft text-brand-1 shadow-brand ring-4 ring-brand-1/10',
  attention:
    'border-amber-200 bg-amber-500/10 text-amber-600 dark:border-amber-900 dark:text-amber-400',
  upcoming: 'border-border bg-muted text-muted-foreground',
};

function defaultIcon(status: TimelineStatus): LucideIcon {
  if (status === 'done') return Check;
  if (status === 'attention') return ShieldAlert;
  if (status === 'current') return CircleDashed;
  return CircleDashed;
}

/**
 * Vertical status rail: filled circle + connector line per item.
 * Follows the run-viewer step conventions (rail column, isLast hides connector).
 */
export function StatusTimeline({
  items,
  label,
  className,
}: {
  items: TimelineItem[];
  /** Accessible name for the list, e.g. "Ticket status". */
  label?: string;
  className?: string;
}) {
  return (
    <ol aria-label={label} className={className}>
      {items.map((item, index) => {
        const Icon = item.icon ?? defaultIcon(item.status);
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border shadow-sm',
                  tone[item.status],
                  item.status === 'upcoming' && 'opacity-70',
                )}
              >
                <Icon className="size-4" />
              </span>
              {!isLast && <span aria-hidden className="my-1 w-px flex-1 bg-border" />}
            </div>
            <div
              className={cn('min-w-0 flex-1 pb-5', item.status === 'upcoming' && 'opacity-70')}
              aria-current={item.status === 'current' ? 'step' : undefined}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-medium">{item.label}</p>
                {item.timestamp && (
                  <time className="text-[11px] whitespace-nowrap text-muted-foreground">
                    {item.timestamp}
                  </time>
                )}
              </div>
              {item.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
