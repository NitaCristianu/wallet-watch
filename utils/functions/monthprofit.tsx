import { parseISO, endOfMonth } from "date-fns";
import { actionType } from "@/constants/types";

export function calcGoalMonthlyBudget(actions: actionType[]): number {
  const today = new Date();
  const daysInMonth = endOfMonth(today).getDate();   // e.g. 31

  let monthlyFlow = 0;    // total predictable inflow/outflow this month

  for (const a of actions) {
    if (a.type !== "commit" || !a.date1 || typeof a.ammount !== "number") 
      continue;

    const start = parseISO(a.date1);
    const end   = a.date2 ? parseISO(a.date2) : null;
    const freq  = a.frequency ?? 1;

    // only count commits that are active today
    if (start <= today && (!end || end >= today)) {
      // average per‐day contribution
      const daily = a.ammount / freq;
      // extrapolate to this month
      monthlyFlow += daily * daysInMonth;
    }
  }

  // only 50% of that flow goes to the goal
  return monthlyFlow * 0.5;
}
