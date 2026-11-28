import { Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  children,
  compact,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  /** Extra content below the action — e.g. suggestion chips. */
  children?: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        compact ? 'py-8' : 'py-12',
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border',
          compact ? 'size-9' : 'size-12',
        )}
      >
        <Icon className={compact ? 'size-4' : 'size-5'} />
      </span>
      <h3 className="mt-1 text-base font-medium">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
