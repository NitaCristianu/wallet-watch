"use client";

import currencies from "@/constants/currencies";
import { projectType, writeActionData } from "@/constants/types";
import {
    ArrowRightCircle,
    Check,
    EuroIcon,
    Globe,
    SaveAll,
    TextIcon,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsBackground from "@/app/backgrounds/settings";

function CurencyInput({
    defaultCurrency,
    className,
}: {
    defaultCurrency: string;
    className?: string;
}) {
    const [error, setError] = useState("Invalid Currency");
    const [showError, setShowError] = useState(false);
    const [currency, setCurrency] = useState(defaultCurrency || "EUR");

    useEffect(() => {
        if (currency.length != 3) {
            setError("Currency must have 3 letters");
            setShowError(true);
        } else if (
            currencies.findIndex((val) => val.code == currency.toUpperCase()) ==
            -1
        ) {
            setError("Currency doesn't exist");
            setShowError(true);
        } else {
            setShowError(false);
        }
    }, [currency]);

    return (
        <>
            <div className={`flex w-90 gap-4 mx-auto ${className}`}>
                <div className="mx-auto bg-gray-200 shadow-xl bg-gradient-to-b to-black/3 rounded-xl text-text-tertiary gap-5 flex items-center px-5 overflow-hidden">
                    <div className="flex text-text-primary items-center gap-2">
                        <Globe />
                        <h1 className=" font-[400] text-2xl ">Currency</h1>
                    </div>
                    <input
                        name="currency"
                        value={currency}
                        type="text"
                        className="h-full w-fit outline-0 p-3 text-4xl bg-black-400/5"
                        placeholder="EUR"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setCurrency(event.target.value.toUpperCase());
                        }}
                    />
                </div>
            </div>
            <motion.p
                className="w-full text-center mt-2 font-light text-lg text-shadow-lg text-shadow text-state-error"
                style={{ textShadow: "0 0 4px rgb(255,0,0,.4)" }}
                initial={{height : 0, opacity : 1}}
                animate={{
                    opacity: showError ? 1 : 0,
                    height: showError ? "auto" : 0,
                    transition: { duration: 0.3 },
                }}
            >
                {error}
            </motion.p>
        </>
    );
}

// -1 is auto
function DailyBudget({ dailybudget }: { dailybudget: number }) {
    const [enabled, setEnabled] = useState(dailybudget != -1 && dailybudget > 0);
    return (
        <AnimatePresence mode="popLayout">
            <div className="w-min mb-10 mt-4">
                <div className="text-2xl text-text-secondary flex h-full items-center gap-5">
                    <p className="text-nowrap">Override daily budget</p>
                    <div className="mt-1">
                        <input
                            type="checkbox"
                            onChange={(e) =>
                                setEnabled(e.currentTarget.checked)
                            }
                            value={enabled ? "on" : "off"}
                            className="w-5 h-5"
                            name="hasdailybudget"
                        />
                    </div>
                    {enabled ? (
                        <motion.div
                            exit={{ scale: 0 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-full text-lg text-text-secondary flex gap-5 items-center"
                        >
                            <div className="rounded-xl overflow-hidden p-2 bg-gray-200 ">
                                <input
                                    name="dailybudget"
                                    placeholder="Budget"
                                    type="number"
                                    defaultValue={100}
                                    className="w-fit max-w-30 outline-0 border-0"
                                />
                            </div>
                        </motion.div>
                    ) : null}
                </div>
                <p className="text-wrap text-xs mt-3 text-text-secondary">
                    {" "}
                    Override the daily budget algorithm, we recomend to leave it
                    disabled.
                </p>
            </div>
        </AnimatePresence>
    );
}

function TitleInput({ title }: { title: string }) {
    return (
        <div className="w-min mb-10">
            <div className="w-full text-2xl text-text-secondary flex gap-5 items-center">
                Title
                <div className="rounded-xl overflow-hidden p-2 card bg-gray-200! ">
                    <input
                        name="title"
                        placeholder="Name your project"
                        defaultValue={title}
                        type="text"
                        className="w-fit outline-0 border-0"
                    />
                </div>
            </div>
            <p className="text-wrap text-xs mt-3 text-text-secondary">
                {" "}
                The title that describes your project the best.
            </p>
        </div>
    );
}

function GoalDedication({ dedication }: { dedication: number }) {
    const [dedicationrate, setDedicationrate] = useState(dedication || 0.5);

    return (
        <div className="w-min">
            <div className="w-full text-2xl text-text-secondary flex gap-5 items-center">
                <p>Allocation ratio</p>
                <div className="rounded-xl card overflow-hidden min-w-50 p-2 bg-gray-200! px-5">
                    <h1 className="text-center">
                        {Math.round(dedicationrate * 100).toFixed(0)}%
                    </h1>
                    <input
                        name="dedication"
                        placeholder="Name your project"
                        type="range"
                        value={dedicationrate}
                        max={0.9}
                        min={0.1}
                        step={0.02}
                        onChange={(e) =>
                            setDedicationrate(Number(e.currentTarget.value))
                        }
                        className="outline-0 border-0 w-full"
                    />
                </div>
            </div>
            <p className="text-wrap text-xs mt-3 text-text-secondary">
                {" "}
                Controls how much of your resources (e.g. income or surplus) are
                dedicated to goals, savings, or risk-aware actions. Higher
                values prioritize long-term outcomes.
            </p>
        </div>
    );
}

function ClientSettingsPage({
    project,
    action,
}: {
    project: projectType;
    action: (d: FormData) => void;
}) {
    return (
        <form
            action={action}
            className="space-y-4 mb-10 flex flex-col items-center bg-white/10 p-5 rounded-2xl"
        >
            {/* <div className="fixed -z-1 left-0 top-0 opacity-20 hue-rotate-90">
                <SettingsBackground />
            </div> */}
            <TitleInput title={project.title!} />
            <CurencyInput defaultCurrency={project.currency!} />
            <GoalDedication dedication={project.Dedication!} />
            <DailyBudget dailybudget={project.dailybudget!} />
            <button className="bg-accent-500 p-3 pl-5 pr-4 relative rounded-xl text-gray-100 mb-10 gap-2 flex hover:bg-accent-700 transition">
                Save changes
                <SaveAll />
            </button>
        </form>
    );
}

export default ClientSettingsPage;
