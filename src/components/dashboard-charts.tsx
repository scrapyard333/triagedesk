"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Slice } from "@/lib/dashboard";

const URGENCY_COLOR: Record<string, string> = {
  critical: "var(--danger)",
  high: "var(--warning)",
  medium: "var(--accent)",
  low: "var(--muted)",
};

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
  fontSize: 12,
};

const tick = { fill: "var(--muted)", fontSize: 12 };

function summary(data: Slice[]) {
  return data.map((slice) => `${slice.name} ${slice.value}`).join(", ");
}

function ChartCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-card border bg-surface p-5 shadow-card ${className ?? ""}`}
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function UrgencyMix({ data }: { data: Slice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div>
      <div
        role="img"
        aria-label={`Urgency mix: ${summary(data)}`}
        className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2"
      >
        {data.map((slice) => (
          <span
            key={slice.key}
            style={{
              width: `${(slice.value / total) * 100}%`,
              background: URGENCY_COLOR[slice.key],
            }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.map((slice) => (
          <li key={slice.key} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: URGENCY_COLOR[slice.key] }}
              aria-hidden="true"
            />
            <span className="text-muted">{slice.name}</span>
            <span className="ml-auto font-medium tabular-nums">
              {slice.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardCharts({
  categories,
  urgencies,
  volume,
}: {
  categories: Slice[];
  urgencies: Slice[];
  volume: Slice[];
}) {
  if (categories.length === 0) {
    return (
      <section className="rounded-card border border-dashed bg-surface p-6 text-center text-sm text-muted">
        Charts appear after your first triaged ticket.
      </section>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="By category" subtitle="What customers write about">
        <div
          role="img"
          aria-label={`Tickets by category: ${summary(categories)}`}
          className="h-56 min-w-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categories}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={112}
                tick={tick}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "var(--surface-2)" }}
              />
              <Bar
                dataKey="value"
                name="Tickets"
                fill="var(--primary)"
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Last 7 days" subtitle="New tickets per day">
        <div
          role="img"
          aria-label={`Tickets in the last 7 days: ${summary(volume)}`}
          className="h-56 min-w-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={volume}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={tick}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                width={40}
                tick={tick}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "var(--surface-2)" }}
              />
              <Bar
                dataKey="value"
                name="Tickets"
                fill="var(--accent)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {urgencies.length > 0 && (
        <ChartCard
          title="Urgency mix"
          subtitle="How quickly your team needs to respond"
          className="lg:col-span-2"
        >
          <UrgencyMix data={urgencies} />
        </ChartCard>
      )}
    </div>
  );
}
