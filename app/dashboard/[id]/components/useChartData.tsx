import { addDays, addMonths, format, parseISO, subMonths } from "date-fns";
import { actionType } from "@/constants/types";
import { useMemo } from "react";

export const useChartData = (actions: actionType[]) => {
  return useMemo(() => {
    if (actions.length === 0) return [];

    // 1️⃣  Map <yyyy-MM>  →  balance
    const monthly: Record<string, number> = {};
    const today = new Date();

    actions.forEach((a) => {
      if (!a.date1 || typeof a.ammount !== "number") return;

      // --- transfers (one-shot) ---
      if (a.type === "transfer") {
        const key = format(parseISO(a.date1), "yyyy-MM");
        monthly[key] = (monthly[key] ?? 0) + a.ammount;
        return;
      }

      // --- commits (recurring) ---
      if (a.type === "commit") {
        const start = parseISO(a.date1);
        const end = a.date2 ? parseISO(a.date2) : today;
        const freq = a.frequency && a.frequency > 0 ? a.frequency : 1; // fallback 1 day

        // iterate occurrences
        for (let d = start; d <= end; d = addDays(d, freq)) {
          const key = format(d, "yyyy-MM");
          monthly[key] = (monthly[key] ?? 0) + a.ammount;
          if (d > today) break; // never project into future
        }
      }
    });

    // 2️⃣  Determine time window (last 12 months or since first action)
    const datePool = actions
      .flatMap((a) => [a.date1, a.date2 ?? a.date1])
      .filter(Boolean)
      .map((d) => parseISO(d!));

    const firstAction = datePool.reduce(
      (min, d) => (d < min ? d : min),
      today
    );
    const lastAction = datePool.reduce(
      (max, d) => (d > max ? d : max),
      today
    );

    const windowStart = subMonths(lastAction, 11); // show 12 months max
    const cursor = new Date(
      Math.max(
        windowStart.getFullYear(),
        firstAction.getFullYear()
      ),
      Math.max(windowStart.getMonth(), firstAction.getMonth()),
      1
    );

    const months: string[] = [];
    while (cursor <= lastAction) {
      months.push(format(cursor, "yyyy-MM"));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    // 3️⃣  Build chart data
    return months.map((key) => {
      const value = monthly[key] ?? 0;
      return {
        month: format(parseISO(`${key}-01`), "MMM"),
        balance: value,
        positive: value > 0 ? value : 0,
        negative: value < 0 ? value : 0,
      };
    });
  }, [actions]);
};
