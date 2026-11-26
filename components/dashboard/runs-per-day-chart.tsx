'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Point = { day: string; completed: number; failed: number; active: number };

const tooltipStyle = {
  background: 'var(--popover)',
  color: 'var(--popover-foreground)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  fontSize: 12,
};

export function RunsPerDayChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={2}>
          <defs>
            <linearGradient id="completed-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.55} />
            </linearGradient>
            <linearGradient id="active-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.55} />
            </linearGradient>
            <linearGradient id="failed-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--muted-foreground)"
            dy={4}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="var(--muted-foreground)"
          />
          <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.5 }} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
          <Bar
            dataKey="completed"
            name="Completed"
            fill="url(#completed-bar)"
            radius={[5, 5, 0, 0]}
            maxBarSize={34}
          />
          <Bar
            dataKey="active"
            name="In progress"
            fill="url(#active-bar)"
            radius={[5, 5, 0, 0]}
            maxBarSize={34}
          />
          <Bar
            dataKey="failed"
            name="Failed"
            fill="url(#failed-bar)"
            radius={[5, 5, 0, 0]}
            maxBarSize={34}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
