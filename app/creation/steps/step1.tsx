"use client";
import { icons } from "@/constants";
import ActionDataPresets from "@/constants/ActionDataPresets";
import currencies from "@/constants/currencies";
import { IonIosHome } from "@/constants/Icons";
import { action_type, writeActionData } from "@/constants/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightCircle, Globe } from "lucide-react";
import Link from "next/link";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";

function CurencyInput({
    currency,
    setCurrency,
    className,
}: {
    defaultCurrency: string;
    className?: string;
    currency: string;
    setCurrency: Dispatch<SetStateAction<string>>;
}) {
    const [error, setError] = useState("Invalid Currency");
    const [showError, setShowError] = useState(false);

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
                        placeholder="CURRENCY"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setCurrency(event.target.value.toUpperCase());
                        }}
                    />
                </div>
            </div>
            <motion.p
                className="w-full text-center mt-2 font-light text-lg text-shadow-lg text-shadow text-state-error"
                style={{ textShadow: "0 0 4px rgb(255,0,0,.4)" }}
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

function Step1({ callback }: { callback: any }) {
    const [error, setError] = useState("Invalid Currency");
    const [showError, setShowError] = useState(false);
    const [title, setTitle] = useState("");

    const [nextstep, setNextstep] = useState(false);
    const [currency, setCurrency] = useState("EUR");

    useEffect(() => {
        if (title.trim().length == 0 && title.length > 0) {
            setError("Title must not be empty");
            setShowError(true);
        } else if (title.length < 5 && title.length > 0) {
            setError("Title must have more than 5 characters");
            setShowError(true);
        } else {
            setShowError(false);
        }
    }, [title]);

    return (
        <motion.div
            exit={{ opacity: 0, transition: { duration: 1 } }}
            animate={{ opacity: 100 }}
            initial={{ opacity: 0, transition: { duration: 1 } }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
        >
            <Link
                href={"/"}
                className="absolute top-10 left-1/2 -translate-x-1/2"
            >
                <IonIosHome className="fill-current text-black-600 hover:text-black-900 transition h-7" />
            </Link>
            <motion.div className="text-3xl md:text-4xl lg:text-5xl text-center  absolute left-1/2 top-1/2 -translate-1/2 p-10 text-nowrap">
                <h1>Give your project a name</h1>
                <div className="rounded-2xl text-2xl mt-10 text-center overflow-hidden p-2 bg-gray-200  text-text-tertiary">
                    <input
                        name="title"
                        placeholder="Name your project"
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                        type="text"
                        className="w-fit text-center outline-0 border-0"
                    />
                </div>
                <motion.p
                    className="w-full text-center mt-2 font-light text-lg text-shadow-lg text-shadow text-state-error"
                    style={{ textShadow: "0 0 4px rgb(255,0,0,.4)" }}
                    animate={{
                        opacity: showError ? 1 : 0,
                        height: showError ? "auto" : 0,
                        transition: { duration: 0.3 },
                    }}
                >
                    {error}
                </motion.p>
                <motion.div
                    animate={{
                        height: nextstep ? "auto" : 0,
                        transition: { duration: 1, ease: "easeInOut" },
                    }}
                    className="overflow-hidden flex flex-col gap-5 m-5"
                >
                    <form>
                        <CurencyInput setCurrency={setCurrency} currency={currency} defaultCurrency="EUR" />
                    </form>
                </motion.div>
                <motion.button
                    animate={{
                        background:
                            title.length <= 0 || showError ? "#ddd" : "#111",
                    }}
                    whileHover={{ width: "190px" }}
                    disabled={title.length <= 0 || showError}
                    initial={{ background: "#ddd" }}
                    className="text-xl mt-10 bg-black-800 p-3 px-6 text-white cursor-pointer flex items-center rounded-full gap-4 mx-auto hover:bg-black-600 transition justify-center"
                    onClick={() => {
                        if (nextstep == false) {
                            setNextstep(true);
                        } else {
                            callback(title, currency);
                        }
                    }}
                >
                    <h1>{nextstep ? "Create" : "Next"}</h1>{" "}
                    <ArrowRightCircle />{" "}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
export default Step1;
