import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const styles = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
} as const;

type Tone = keyof typeof styles;

// One place that decides which status gets which color.
const statusTone: Record<string, Tone> = {
  open: 'info',
  running: 'info',
  pending: 'warning',
  waiting_approval: 'warning',
  resolved: 'success',
  completed: 'success',
  failed: 'danger',
  escalated: 'danger',
  closed: 'neutral',
  cancelled: 'neutral',
  queued: 'warning',
  processing: 'info',
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone[status.toLowerCase()] ?? 'neutral';
  const label = status.replace(/_/g, ' ');
  return (
    <Badge variant="secondary" className={cn('border-transparent capitalize', styles[tone])}>
      {label}
    </Badge>
  );
}       