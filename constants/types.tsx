import { Project, Action, User } from "@/sanity/sanity/schemaTypes";

export type action_type = "transfer" | "commit" | "goal";

// null means default, most defaults will be mapped into "", date will become today
// ui is lightmode
// goal is determined by ammount, date, currency, color, sign, etc. sign represents regular goal : my goal is making 300$ by june, or a anti-goal which represents : my goal is staying above 300$ by june

export interface writeActionData {
    type: action_type | null;
    title: string | null;
    icon: string | null;
    ammount: number | null;
    currency: string | null;
    frequency: number | null; // null if one time, otherwise is number of days
    other: string | null; // payee or payer name
    description: string | null;
    color: string | null; // hex
    sign: boolean | null; // true means income, false means expense
    date: Date | null;
}

export type projectType = Omit<Project, "user"> & { user?: User };
export type actionType = Omit<Action, "user"> & { user?: User };
export type messageType = { author: "ai" | "user" | "system"; content: string };
