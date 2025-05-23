import {
  parseISO,
  differenceInDays,
  addDays,
  isAfter,
  isBefore,
} from "date-fns";
import { actionType } from "@/constants/types";

export function estimateGoalDate(goal: actionType, actions: actionType[]) {
  const today = new Date();
  const goalAmount = Math.abs(goal.ammount ?? 0);
  const goalsign = Math.sign(goal.ammount!);

  let saved = 0;
  let dailyRate = 0;

  for (const action of actions) {
    if (typeof action.ammount !== "number" || !action.date1) continue;
    const start = parseISO(action.date1);

    if (action.type === "transfer") {
      if (!isAfter(start, today)) saved += action.ammount * goalsign;
    }

    if (action.type === "commit") {
      const freq = action.frequency ?? 1;
      const end = action.date2 ? parseISO(action.date2) : today;

      // ⬇️ Count occurrences up to today
      if (!isBefore(end, start)) {
        const days = differenceInDays(isAfter(end, today) ? today : end, start);
        const count = Math.floor(days / freq) + 1;
        saved += count * action.ammount * goalsign;
      }

      // ⬇️ Add to daily inflow if active today
      const stillActive =
        !action.date2 || isAfter(parseISO(action.date2), today);
      if (!isAfter(start, today) && stillActive) {
        dailyRate += action.ammount / freq;
      }
    }
  }

  if (saved >= goalAmount) {
    return {
      goal,
      saved,
      dailyRate,
      eta: today,
    };
  }

  if (dailyRate <= 0) {
    return {
      goal,
      saved,
      dailyRate,
      eta: null,
    };
  }

  const daysNeeded = Math.ceil((goalAmount - saved) / dailyRate);
  const eta = addDays(today, daysNeeded*2);

  return {
    goal,
    saved,
    dailyRate,
    eta,
  };
}
