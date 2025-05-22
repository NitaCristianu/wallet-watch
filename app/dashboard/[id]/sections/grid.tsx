"use client"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { action_type, projectType } from "@/constants/types";
import { Action } from "@/sanity/sanity/schemaTypes";
import { useEffect, useRef } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

function GraphGrid({ project }: { project: projectType, actions: Action[] }) {
  

  return (
    <section className="fixed overflow-hidden w-screen h-screen bg-surface-200" >
      <ChartContainer config={chartConfig as any}>
        <ResponsiveContainer height={500} width="20%">
          <AreaChart
            accessibilityLayer
            data={chartData}

          >
            <CartesianGrid vertical={false} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="95%"
                  stopColor="#f00"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#ff0"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a" 
            />

          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </section>
  );
}

export default GraphGrid;
