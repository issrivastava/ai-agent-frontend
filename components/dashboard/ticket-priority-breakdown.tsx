import { cn } from '@/lib/utils';

const colors: Record<string, string> = {
  low: 'bg-slate-400 dark:bg-slate-500',
  medium: 'bg-sky-500',
  high: 'bg-amber-500',
  urgent: 'bg-rose-500',
};

export function TicketPriorityBreakdown({ data }: { data: { priority: string; count: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percent = total ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.priority} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium capitalize">
                <span className={cn('size-2 rounded-full', colors[item.priority] ?? colors.low)} />
                {item.priority}
              </span>
              <span className="text-muted-foreground">
                {item.count} · {percent}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', colors[item.priority] ?? colors.low)}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
      {total === 0 && (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No tickets to break down yet.
        </p>
      )}
    </div>
  );
}
