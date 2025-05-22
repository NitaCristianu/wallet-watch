"use client";
import { actionType } from "@/constants/types";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";

function FullGraph({
    actions,
    currency,
}: {
    actions: actionType[];
    currency: string;
}) {
    const chartData = useMemo(() => {
        const monthlyMap: Record<string, number> = {};

        // First pass: populate balances
        for (const action of actions) {
            if (action.type == "goal") continue;
            if (!action.date1 || typeof action.ammount !== "number") continue;

            if (action.type === "transfer") {
                const date = parseISO(action.date1);
                const monthKey = format(date, "yyyy-MM");
                monthlyMap[monthKey] =
                    (monthlyMap[monthKey] || 0) + action.ammount;
            }

            if (action.type === "commit" && action.date2 && action.frequency) {
                const start = parseISO(action.date1);
                const end = parseISO(action.date2);
                const freq = action.frequency;

                for (
                    let d = new Date(start);
                    d <= end;
                    d.setDate(d.getDate() + freq)
                ) {
                    const monthKey = format(d, "yyyy-MM");
                    monthlyMap[monthKey] =
                        (monthlyMap[monthKey] || 0) + action.ammount;
                }
            }
        }

        // Compute full timeline range
        const allDates = actions
            .filter((a) => a.type != "goal")
            .flatMap((a) => [a.date1, a.date2 ?? a.date1])
            .filter(Boolean)
            .map((d) => parseISO(d!));

        const start = allDates.reduce(
            (min, d) => (d < min ? d : min),
            new Date(),
        );
        const end = allDates.reduce(
            (max, d) => (d > max ? d : max),
            new Date(),
        );

        const now = new Date();
        const minAllowed = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        const months: string[] = [];
        const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
        const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

        while (cursor <= endMonth) {
            if (cursor >= minAllowed) {
                const monthKey = format(cursor, "yyyy-MM");
                months.push(monthKey);
            }
            cursor.setMonth(cursor.getMonth() + 1);
        }

        return months.map((monthKey) => {
            const value = monthlyMap[monthKey] ?? 0;
            return {
                month: format(parseISO(monthKey + "-01"), "MMMM"),
                balance: value,
                positive: value > 0 ? value : 0,
                negative: value < 0 ? value : 0,
            };
        });
    }, [actions]);

    const chartConfig = {
        balance: {
            label: "Balance",
            color: "hsl(#00f)",
        },
    } satisfies ChartConfig;

    return (
        <div className="pt-10 pr-7">
            <CardHeader>
                <CardTitle className="text-text-primary text-lg">
                    Current Balance Trend
                </CardTitle>
                <CardDescription className="pb-10">
                    Based on transfers and recurring transactions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        margin={{ top: 20, bottom: 20 }}
                        accessibilityLayer
                        data={chartData}
                    >
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) =>
                                `${value.toFixed(0)} ${currency}`
                            }
                        />
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <defs>
                            <linearGradient
                                id="fillBalance"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#00f"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#00f"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="balance"
                            type="natural"
                            fill="url(#fillBalance)"
                            fillOpacity={0.4}
                            stroke="var(--color-balance)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full pt-3 items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center text-text-primary gap-2 font-medium leading-none">
                            Trending up over time{" "}
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none t text-text-secondary">
                            Past few months
                        </div>
                    </div>
                </div>
            </CardFooter>
        </div>
    );
}

export default FullGraph;
