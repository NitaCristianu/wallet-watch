"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";
import { parseISO, isBefore } from "date-fns";
import { actionType } from "@/constants/types";

/**
 * Compute top 3 expense sources (negative amounts) aggregated over all time.
 */
function getTopThree(actions: actionType[]) {
  const totals: Record<string, number> = {};
  const today = new Date();

  actions.forEach((a) => {
    if (a.type === "goal" || typeof a.ammount !== "number" || a.ammount >= 0)
      return;

    if (a.type === "transfer") {
      totals[a.title!] = (totals[a.title!] ?? 0) + Math.abs(a.ammount);
      return;
    }

    if (a.type === "commit") {
      const freq = a.frequency ?? 30;
      const start = parseISO(a.date1!);
      const end = a.date2 ? parseISO(a.date2) : today;

      for (let d = new Date(start); !isBefore(end, d); d.setDate(d.getDate() + freq)) {
        totals[a.title!] = (totals[a.title!] ?? 0) + Math.abs(a.ammount);
      }
    }
  });

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}

export default function TopThreeExpenses({
  actions,
  currency,
  title = "Top 3 Expenses",
}: {
  actions: actionType[];
  currency: string;
  title?: string;
}) {
  const top = getTopThree(actions);
  if (top.length < 3) return null;

  const colors = ["#EA4C46", "#F9A825", "#5C6BC0"];
  const chartData = top.map(([name, total], idx) => ({
    id: `cat${idx}`,
    name,
    total,
    color: colors[idx],
  }));

  const chartConfig: ChartConfig = { total: { label: "Total" } } as ChartConfig;
  chartData.forEach((d) => {
    (chartConfig as any)[d.id] = { label: d.name, color: d.color };
  });

  return (
    <ChartContainer config={chartConfig} >
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ left: 20, right: 60, top: 10, bottom: 10 }}
      >
        <defs>
          {chartData.map((d) => (
            <linearGradient key={d.id} id={`grad-${d.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={d.color} stopOpacity={1} />
              <stop offset="100%" stopColor={d.color} stopOpacity={0.5} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)" }}
          tickFormatter={value=>`${value}`.toUpperCase()}
        />
        <XAxis type="number" hide />

        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

        {/* single Bar with individual <Cell> for alignment */}
        <Bar dataKey="total" radius={4}>
          {chartData.map((d) => (
            <Cell key={d.id} fill={`url(#grad-${d.id})`} />
          ))}
          <LabelList
            dataKey="total"
            position="right"
            formatter={(v: any) => `${v} ${currency}`}
            className="fill-primary font-[400]"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}