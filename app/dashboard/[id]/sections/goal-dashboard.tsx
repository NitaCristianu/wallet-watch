"use client";
import { FluentTargetArrow20Regular } from "@/constants/Icons";
import { actionType, projectType } from "@/constants/types";
import { estimateGoalDate } from "@/utils/functions/goalestimated";
import { TriggerProvider } from "@/utils/open-modal-utils";
import { ArrowDownNarrowWide, Calendar, Calendar1, CalendarArrowUp, Target } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { calcGoalMonthlyBudget } from "@/utils/functions/monthprofit";
import MonthGraph from "../components/monthgraph";
import { nextOccurrences } from "@/utils/functions/getnextexpenses";
import { differenceInCalendarDays } from "date-fns";

function Card1({
  actions,
  currency,
}: {
  actions: actionType[];
  currency: string;
}) {
  const goals = actions.filter((a) => a.type == "goal");
  const hasGoals = goals.length > 0;
  const [selectedgoal, setGoal] = useState(
    hasGoals ? goals[goals.length - 1] : ({} as actionType)
  );
  const goal_data = estimateGoalDate(selectedgoal, actions);
  const formattedETA = goal_data.eta
    ? format(goal_data.eta, "dd MMM yyyy")
    : "Unreachable";
  const savingformat = goal_data.eta
    ? goal_data.saved < (selectedgoal.ammount || 0)
      ? `Saved: ${goal_data.saved} / ${selectedgoal.ammount} ${currency}`
      : "Congrats! You've achieved it!"
    : "No saving yet.";

  return (
    <div
      style={{ background: selectedgoal.color || "#f84949" }}
      className="card rounded-2xl overflow-hidden to-black/20! transition duration-300 ease-in-out"
    >
      {!hasGoals ? (
        <div className="text-gray-100 text-xl md:text-4xl flex-col flex items-center p-10 text-center">
          {/* >0 goals */}
          <FluentTargetArrow20Regular className="fill-current w-10 h-10 md:w-20 md:h-20 mb-3" />
          <h1 className=" font-semibold  ">Set your first goal!</h1>
          <p className="text-sm text-gray-100/60 mt-3">
            Tap on the top right button to set a goal.
          </p>
        </div>
      ) : (
        <div className="flex md:h-80 max-sm:flex-col overflow-hidden relative">
          <Target className="absolute w-130 h-130 top-50 left-200 stroke-black/10 -translate-1/2" />
          <div className="max-sm:text-center grow md:pl-10 py-10 flex flex-col justify-between h-full max-sm:gap-5">
            <div>
              <h1 className="capitalize text-gray-100 md:text-3xl text-xl font-semibold max-sm:text-3xl">
                {selectedgoal.title}
              </h1>
              <p className="text-gray-100/50">{selectedgoal.description}</p>
            </div>
            <div className="text-lg text-gray-100 flex max-sm:flex-col max-sm:p-6 items-center justify-between rounded-xl px-5 max-sm:mx-5 md:mr-10 bg-black/10 backdrop-blur-2xl">
              <p className="">
                You will achieve it by{" "}
                <span className="text-xl">{formattedETA}</span>
              </p>
              <p className=" p-3 w-fit rounded-lg">{savingformat}</p>
            </div>
          </div>

          <ul className="shadow-2xl h-full max-sm:w-full md:px-10 py-3 overflow-y-auto backdrop-blur-md  bg-black/10 text-gray-100/60">
            <h1 className="text-lg text-gray-100/90 text-center underline decoration-1 w-full underline-offset-6 mt-3 max-sm:text-2xl mb-6">
              Other goals
            </h1>
            <div className="space-y-3 mx-auto w-fit">
              {...goals.map((goal, i) => (
                <motion.li
                  key={i}
                  className="cursor-pointer text-wrap max-w-40 text-center capitalize"
                  animate={{
                    color: goal.title == selectedgoal.title ? "#fffa" : "#fff8",
                  }}
                  whileHover={{
                    color: goal.title != selectedgoal.title ? "#fffc" : "#fff",
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onTap={() => setGoal(goal)}
                >
                  {goal.title}
                </motion.li>
              ))}
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}

function Card2({
  actions,
  currency,
}: {
  actions: actionType[];
  currency: string;
}) {
  return (
    <div className="card flex flex-col p-10 grow">
      <h1 className="grow text-2xl font-semibold text-text-primary">
        Current month vs Previous Month
      </h1>
      <h4 className="grow text-text-secondary">
        Based on every transaction, in {currency}
      </h4>
      <div className="md:px-14">
        <MonthGraph actions={actions} />
      </div>
      <div className="w-full p-3 rounded-xl mt-2 flex justify-end">
        <div className="pr-10">
          <h1 className="text-red-400 ">Previous month (RED)</h1>
          <h1 className="text-blue-400 ">Current month (BLUE)</h1>
        </div>
      </div>
    </div>
  );
}

function Card4({
  actions,
  currency,
}: {
  actions: actionType[];
  currency: string;
}) {
  const followups = nextOccurrences(actions, 20, 365, true);
  const now = new Date();

  return (
    <div className="card to-black/50 p-5 pt-9 w-100 max-w-full flex h-full flex-col overflow-y-auto justify-center bg-purple-400! relative overflow-hidden ">
      <CalendarArrowUp className="absolute w-100 h-100 left-10 text-purple-500/50!" />
      <div className="z-2 w-full backdrop-blur-md pt-3 rounded-xl overflow-hidden">
        <h1 className="text-3xl text-center text-gray-100 font-semibold mb-1 ">
          Incoming expenses
        </h1>
        <div className="grid grid-cols-3  shadow-2xl  py-10 px-3 rounded-xl">
          <div className="flex flex-col gap-px text-gray-100">
            <h1 className="text-center font-semibold text-lg">Category</h1>
            {...followups.map((value, i) => (
              <div
                key={i}
                className="text-left font-[300] text-lg flex w-full justify-evenly text-gray-200"
              >
                <p>{value.src.title}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-px">
            <h1 className="text-center font-semibold text-lg text-gray-100">
              Amount
            </h1>
            {...followups.map((value, i) => (
              <div
                key={i}
                className="text-center font-[300] text-lg flex w-full justify-evenly text-gray-200"
              >
                <p>
                  {value.amount} {currency}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-px">
            <h1 className="text-center font-semibold text-lg text-gray-100">
              In X days
            </h1>
            {...followups.map((value, i) => (
              <div
                key={i}
                className="text-center font-[300] text-lg flex w-full justify-evenly text-gray-200"
              >
                <p>{-differenceInCalendarDays(now, value.date)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card3({
  actions,
  currency,
}: {
  actions: actionType[];
  currency: string;
}) {
  const profit = calcGoalMonthlyBudget(actions);

  return (
    <div className="card to-black/10 p-5 h-full my-auto flex flex-col md:w-1/4">
      <h1 className="text-2xl text-text-primary pt-4 text-center text-wrap font-semibold mb-6">
        Monthly Profit
      </h1>

      <div className="grow grid place-items-center">
        <h1
          className="text-6xl font-bold text-center"
          style={{
            color: `var(${profit >= 0 ? "--color-state-success" : "--color-state-error"})`,
          }}
        >
          {profit.toFixed(1)}
          <br />
          {currency}
        </h1>
      </div>
    </div>
  );
}
function GoalDashboard({
  project,
  actions,
  currency,
}: {
  project: projectType;
  actions: actionType[];
  currency: string;
}) {
  return (
    <section className="pb-20">
      <h1 className="mb-20 mx-5 text-7xl font-semibold uppercase text-text-primary text-center">
        AIM FOR MORE!
      </h1>
      <div className="flex flex-col md:flex-row h-full gap-10">
        <div className="flex-col flex grow gap-10">
          <Card1 actions={actions} currency={currency} />
          <div className="flex max-sm:flex-col gap-10">
            <Card2 actions={actions} currency={currency} />
            <Card3 actions={actions} currency={currency} />
          </div>
        </div>
        <div className="grow">
          <Card4 actions={actions} currency={currency} />
        </div>
      </div>
    </section>
  );
}

export default GoalDashboard;
