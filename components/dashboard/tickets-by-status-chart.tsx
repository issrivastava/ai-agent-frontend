'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const colors: Record<string, string> = {
  open: 'var(--chart-1)',
  pending: 'var(--chart-4)',
  escalated: 'var(--chart-5)',
  resolved: 'var(--chart-3)',
  closed: 'var(--chart-2)',
};

const tooltipStyle = {
  background: 'var(--popover)',
  color: 'var(--popover-foreground)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  fontSize: 12,
};

export function TicketsByStatusChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const chartData = data.filter((item) => item.count > 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:h-64 sm:flex-row sm:justify-center">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [
                value,
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
            />
            <Pie
              data={chartData.length ? chartData : [{ status: 'empty', count: 1 }]}
              dataKey="count"
              nameKey="status"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={chartData.length ? 3 : 0}
              strokeWidth={0}
            >
              {chartData.length ? (
                chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={colors[entry.status] ?? 'var(--chart-2)'}
                    className="outline-none"
                  />
                ))
              ) : (
                <Cell fill="var(--muted)" />
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tracking-tight">{total}</span>
          <span className="text-[11px] text-muted-foreground">total tickets</span>
        </div>
      </div>

      <ul className="grid w-full max-w-xs grid-cols-2 gap-x-4 gap-y-2 sm:max-w-none sm:grid-cols-1">
        {data.map((entry) => (
          <li key={entry.status} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 capitalize">
              <span
                className="size-2 rounded-full"
                style={{ background: colors[entry.status] ?? 'var(--chart-2)' }}
              />
              <span className="text-muted-foreground">{entry.status}</span>
            </span>
            <span className="font-medium">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
