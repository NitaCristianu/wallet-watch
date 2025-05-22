import { action_type, actionType, writeActionData } from "./types";
import { HiShoppingBag } from "react-icons/hi2";
import { GoGoal } from "react-icons/go";
import { MdGroups } from "react-icons/md";
import { IconType } from "react-icons/lib";
import { parseISO, isSameMonth, differenceInCalendarDays } from "date-fns";

export type predefined_action_kinds_type = {
  [key in action_type]: string[];
};

export const icons: Record<string, IconType> = {
  HiShoppingBag: HiShoppingBag,
  MdGroups: MdGroups,
  GoGoal: GoGoal,
};

export function calcMonthBudget(actions: actionType[]): number {
  const today = new Date();

  return actions.reduce((sum, action) => {
    if (!action.date1 || typeof action.ammount !== "number") return sum;

    // -------- transfers (one-shot) --------
    if (action.type === "transfer") {
      if (isSameMonth(parseISO(action.date1), today)) {
        return sum + action.ammount;
      }
      return sum;
    }

    // -------- commits (recurring) --------
    if (action.type === "commit") {
      const start = parseISO(action.date1);
      const end = action.date2 ? parseISO(action.date2) : today;
      const freq = action.frequency ?? 1; // fallback 1 day

      // iterate recurrences only inside current month
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + freq)) {
        if (isSameMonth(d, today)) {
          sum += action.ammount;
        }
        if (d > today) break; // don’t iterate into the future
      }
    }

    return sum;
  }, 0);
}

