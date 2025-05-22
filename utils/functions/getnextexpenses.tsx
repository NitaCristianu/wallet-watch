import {
  parseISO,
  addDays,
  isAfter,
  isSameDay,
  differenceInCalendarDays,
} from "date-fns";
import { actionType } from "@/constants/types";

/**
 * Următoarele `n` apariții (cheltuieli sau venituri) de la `today`.
 * @param actions   lista de acțiuni (fără goal)
 * @param n         câte apariții să întoarcă
 * @param horizon   câte zile în viitor să genereze (default 365)
 * @param onlyNeg   true => doar cheltuieli; false => doar venituri; null => ambele
 */
export function nextOccurrences(
  actions: actionType[],
  n: number,
  horizon = 365,
  onlyNeg: boolean | null = null
) {
  const today = new Date();
  const futureLimit = addDays(today, horizon);

  const out: { date: Date; amount: number; src: actionType }[] = [];

  for (const a of actions) {
    if (a.type === "goal" || typeof a.ammount !== "number" || !a.date1)
      continue;

    // Filtru pe semn dacă e cazul
    if (onlyNeg === true && a.ammount >= 0) continue;
    if (onlyNeg === false && a.ammount <= 0) continue;

    if (a.type === "transfer") {
      const d = parseISO(a.date1);
      if (isAfter(d, today) || isSameDay(d, today)) {
        out.push({ date: d, amount: a.ammount, src: a });
      }
    }

    if (a.type === "commit") {
      const freq = a.frequency ?? 30; // default 30 zile
      const start = parseISO(a.date1);
      const end = a.date2 ? parseISO(a.date2) : futureLimit;

      // Pornește de la primul occurrence ≥ azi
      let first = start;
      if (isAfter(today, start)) {
        const diff = differenceInCalendarDays(today, start);
        const steps = Math.floor(diff / freq);
        first = addDays(start, steps * freq);
        while (isAfter(today, first)) first = addDays(first, freq);
      }

      for (let d = first; d <= end && d <= futureLimit; d = addDays(d, freq)) {
        out.push({ date: d, amount: a.ammount, src: a });
      }
    }
  }

  return out
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // cele mai apropiate în față
    .slice(0, n);
}
