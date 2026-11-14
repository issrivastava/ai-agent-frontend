import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function KpiCard({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value: string | number | null;
  hint?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {loading ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <p className="text-3xl font-semibold">{value ?? '—'}</p>
        )}
        {hint && !loading && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}