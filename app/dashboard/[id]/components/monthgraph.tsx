"use client";

import React, { act } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  addDays,
  differenceInCalendarDays,
  isWithinInterval,
  isSameMonth,
} from "date-fns";
import { actionType } from "@/constants/types";
import { Euro } from "lucide-react";

interface Props {
  actions: actionType[];
}

export default function MonthlyBalanceComparison({ actions }: Props) {
  // Determine current month (now) and previous month using date-fns

  // Assume actions is an array of all action objects.
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });

  // Get previous month name
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const previousMonth = prevMonthDate.toLocaleString("default", {
    month: "long",
  });
  const chartData: { day: string; prev: number; curr: number }[] = [];

  const startOfApril = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1)
  );
  const endOfMay = endOfMonth(new Date(now.getFullYear(), now.getMonth(), 31));

  // Prepare an entry for each day of April (1–30) and May (1–31).
  for (let day = 1; day <= 31; day++) {
    const record = { day: day.toString(), prev: 0, curr: 0 };
    chartData.push(record);
  }

  // Iterate through each action and accumulate its effects on the appropriate days.
  for (const action of actions) {
    const { type, ammount, date1, date2, frequency } = action;
    if (type === "goal") continue; // skip goal actions entirely

    // Parse the dates for comparison (assuming date strings in "YYYY-MM-DD" format):
    const start = new Date(date1!);
    const end = date2 ? new Date(date2) : endOfMay; // if no end date, treat as active through end of May

    if (type === "transfer") {
      // One-time transfer on date1
      if (start >= startOfApril && start <= endOfMay) {
        const d = start.getDate();
        const m = start.getMonth(); // 3 for April, 4 for May (zero-based index)
        if (m === 3) chartData[d - 1].prev += ammount!; // d-1 because array index 0 = day 1
        if (m === 4) chartData[d - 1].curr += ammount!;
      }
    } else if (type === "commit") {
      // Determine frequency in days (default 30 if not provided)
      const interval = frequency ? Number(frequency) : 30;
      // Generate all occurrences from start date through end date (inclusive)
      for (
        let current = new Date(start);
        current <= end && current <= endOfMay;

      ) {
        // If current occurrence falls in April or May, add the amount on that day
        if (current >= startOfApril) {
          const d = current.getDate();
          const m = current.getMonth();
          if (m === 3) chartData[d - 1].prev += ammount!;
          if (m === 4) chartData[d - 1].curr += ammount!;
        }
        // Move to the next occurrence date by adding the interval (in milliseconds)
        current.setDate(current.getDate() + interval);
      }
    }
  }

  const chartConfig: ChartConfig = {
    prev: { label: currentMonth, color: "#f97316", icon: Euro },
    curr: { label: previousMonth, color: "#3b82f6", icon: Euro },
  };

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 5, right: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00f" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f00" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="prev"
            type="natural"
            fill="url(#fillMobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <Area
            dataKey="curr"
            type="natural"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
