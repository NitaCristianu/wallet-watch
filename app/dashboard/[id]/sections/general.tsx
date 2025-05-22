import { Card } from "@/components/ui/card";
import { actionType, projectType } from "@/constants/types";
import FullGraph from "../components/FullGraph";
import { BanknoteArrowDown, ShoppingBag } from "lucide-react";
import { calcMonthBudget } from "@/constants";
import { parseISO, isSameDay } from "date-fns";
import Top3 from "../components/top3";

function Card1({
    actions,
    currency,
}: {
    actions: actionType[];
    currency: string;
}) {
    return (
        <div className="card col-span-2 row-span-2 h-fit md:h-auto pb-9">
            <div className="md:px-14">
                <FullGraph currency={currency} actions={actions} />
            </div>
        </div>
    );
}

function Card2({
    actions,
    currency,
    project,
}: {
    actions: actionType[];
    project: projectType;
    currency: string;
}) {
    const today = new Date();
    var monthbuget = calcMonthBudget(actions);
    if (monthbuget == 0) monthbuget += 0.00001;
    var dailybudget = (monthbuget / 30) * (project.Dedication || 0.5);
    var { income: todayIncome, expenses: todayExpenses } = actions.reduce(
        (acc, a) => {
            if (
                a.type === "transfer" &&
                a.date1 &&
                typeof a.ammount === "number" &&
                isSameDay(parseISO(a.date1), today)
            ) {
                if (a.ammount > 0)
                    acc.income += a.ammount; // venit
                else if (a.ammount < 0) acc.expenses += -a.ammount; // cheltuială
            }
            return acc;
        },
        { income: 0, expenses: 0 },
    );

    if (todayIncome > 0) {
        dailybudget += todayIncome;
        todayIncome = 0;
    }
    dailybudget = Math.max(dailybudget, 0);
    const procentage = Math.min(
        Math.max(0, Math.round((todayExpenses / dailybudget) * 100)),
        100,
    );

    return (
        <div className="card bg-accent-500! to-white/20 items-center flex flex-col md:text-xl text-gray-100 justify-center p-15">
            <ShoppingBag className="md:h-10 md:w-10 sm:w-5 md-5" />
            <h1 className="text-shadow-lg font-semibold ">DAILY BUDGET</h1>
            <h5 className="text-shadow-lg md:text-lg text-xs md:mb-2 font-semibold ">
                {todayExpenses} / {dailybudget.toFixed(2)} {currency}
            </h5>
            <div className="w-4/5 mx-5 h-5 my-2 rounded-xl overflow-hidden border-2 border-gray-100 p-px flex flex-col justify-end">
                <div
                    className="transition duration-500 h-full w-0 bg-gray-100 rounded-lg"
                    style={{
                        width: dailybudget != 0 ? `${procentage}%` : 0,
                    }}
                ></div>
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
    return (
        <div className="card pt-0 p-10 mt-10 w-full md:w-[21vw]">
            <h1 className="text-2xl text-center mt-5 font-semibold">
                TOP 3 EXPENSES
            </h1>
            <Top3 actions={actions} currency={currency} />
        </div>
    );
}

function GeneralSection({
    project,
    actions,
    currency,
}: {
    project: projectType;
    actions: actionType[];
    currency: string;
}) {
    return (
        <section className="pt-[10vh] pb-[20vh] relative">
            <h1 className="mb-20 mx-5 text-7xl font-semibold uppercase text-text-primary text-center">
                general data
            </h1>
            <div className="flex flex-col md:flex-row lg:grid-cols-3 lg:grid-rows-2 h-full px-0 md:px-[5vw] gap-10 ">
                <div className="grow">
                    <Card1 currency={currency} actions={actions} />
                </div>
                <div className="grow flex flex-col justify-evenly gap-10 md:gap-0">
                    <Card2
                        project={project}
                        actions={actions}
                        currency={currency}
                    />
                    <Card3 actions={actions} currency={currency} />
                </div>
            </div>
        </section>
    );
}

export default GeneralSection;
