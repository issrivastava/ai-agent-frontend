import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const kpis = [
  { label: 'Open tickets', value: '—' },
  { label: 'Active agent runs', value: '—' },
  { label: 'Resolution rate', value: '—' },
  { label: 'Avg. resolution time', value: '—' },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your agents and support queue." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{k.value}</CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
