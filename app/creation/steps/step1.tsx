"use client";
import FloatingCreateButton from "@/app/dashboard/[id]/components/FloatingCreatebutton";
import FloatingModal from "@/app/dashboard/[id]/components/FloatingModal";
import FloatingElements from "@/app/dashboard/[id]/sections/floating";
import { icons } from "@/constants";
import ActionDataPresets from "@/constants/ActionDataPresets";
import currencies from "@/constants/currencies";
import {
    IonIosHome,
    MaterialSymbolsLightArrowRightAltRounded,
    MaterialSymbolsLightKeyboardArrowDownRounded,
    MaterialSymbolsLightSoundDetectionGlassBreakOutlineRounded,
    MaterialSymbolsMoneyBagRounded,
} from "@/constants/Icons";
import { action_type, projectType, writeActionData } from "@/constants/types";
import { TriggerProvider, useTrigger } from "@/utils/open-modal-utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightCircle, Globe, Plus } from "lucide-react";
import { nanoid } from "nanoid";
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

const StaggeredDropDown = (params: {
    options: { Icon: any; text: action_type }[];
}) => {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            animate={{ marginBottom: open ? "130px" : 0 }}
            className="p-8 z-2 flex items-center justify-center"
        >
            <motion.div animate={open ? "open" : "closed"} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((pv) => !pv)}
                    className="flex items-center gap-2 max-sm:px-2 md:px-4 py-2  rounded-full md:rounded-lg text-indigo-50 bg-black-600 hover:bg-black-500 transition-colors cursor-pointer"
                >
                    <span>
                        <span className="font-medium max-sm:hidden">
                            Create action
                        </span>
                        <Plus className="font-medium md:hidden"></Plus>
                    </span>
                    <motion.span
                        variants={iconVariants}
                        className="w-7 fill-current max-sm:hidden"
                    >
                        <MaterialSymbolsLightKeyboardArrowDownRounded className="max-sm:hidden" />
                    </motion.span>
                </button>

                <motion.ul
                    initial={wrapperVariants.closed}
                    variants={wrapperVariants}
                    style={{ originY: "top", translateX: "-50%" }}
                    className="flex flex-col gap-2 p-2 rounded-lg bg-gray-100 shadow-xl absolute top-[120%] left-[50%] flow-hidden"
                >
                    {params.options.map((option) => (
                        <Option
                            {...option}
                            setOpen={setOpen}
                            key={option.text}
                        />
                    ))}
                </motion.ul>
            </motion.div>
        </motion.div>
    );
};

const Option = ({
    text,
    Icon,
    setOpen,
}: {
    text: action_type;
    Icon: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const trigger = useTrigger();

    return (
        <motion.li
            variants={itemVariants}
            onTap={() => {
                setOpen(false);
                trigger(text);
            }}
            className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-accent-100 text-text-tertiary hover:text-accent-500 transition-colors md:w-48 cursor-pointer capitalize"
        >
            <motion.span
                variants={actionIconVariants}
                className="w-4 fill-current"
            >
                {Icon}
            </motion.span>
            <span>{text}</span>
        </motion.li>
    );
};

const Options: {
    text: action_type;
    Icon: any;
}[] = [
    { text: "commit", Icon: <MaterialSymbolsMoneyBagRounded /> },
    { text: "transfer", Icon: <IonIosHome /> },
    {
        text: "goal",
        Icon: <MaterialSymbolsLightSoundDetectionGlassBreakOutlineRounded />,
    },
];

function Step1({
    callback,
    projects,
}: {
    callback: any;
    projects: projectType[];
}) {
    const [error, setError] = useState("Invalid Currency");
    const [showError, setShowError] = useState(false);
    const [title, setTitle] = useState("");

    const [nextstep, setNextstep] = useState(false);
    const [currency, setCurrency] = useState("EUR");
    const [showModal, setShowModal] = useState<action_type | null>(null);
    const [actions, setActions] = useState<any[]>([]);

    useEffect(() => {
        if (title.trim().length == 0 && title.length > 0) {
            setError("Title must not be empty");
            setShowError(true);
        } else if (title.length < 5 && title.length > 0) {
            setError("Title must have more than 5 characters");
            setShowError(true);
        } else if (
            projects.findIndex(
                (p) =>
                    p.title?.trim().toLowerCase() == title.trim().toLowerCase(),
            ) != -1
        ) {
            setError("Project already exists");
            setShowError(true);
        } else {
            setShowError(false);
        }
    }, [title]);

    return (
        <motion.div
            exit={{ opacity: 0, transition: { duration: 1 } }}
            animate={{ opacity: 1 }}
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
                        className="w-full text-center outline-0 border-0"
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
                    initial={{ height: 0 }}
                    className="overflow-hidden flex flex-col gap-5 m-5"
                >
                    <div>
                        <CurencyInput
                            setCurrency={setCurrency}
                            currency={currency}
                            defaultCurrency="EUR"
                        />
                        <TriggerProvider onTrigger={(d) => setShowModal(d)}>
                            <div className="w-fit text-lg mx-auto">
                                <StaggeredDropDown options={Options} />
                            </div>
                            <div className="w-full h-full relative overflow-x-hidden ">
                                <FloatingModal
                                    visible={showModal}
                                    classname={`w-[40vw]! left-[0]! overlfow-x-hidden! text-lg! h-[100vh]! ${!showModal ?"hidden" : "visible"}`}
                                    servercallback={(data: any, type) => {
                                        const minDays = 1;
                                        const maxDays = 365;
                                        const frequency = Math.round(
                                            minDays *
                                                Math.pow(
                                                    maxDays / minDays,
                                                    data.frequency / 100,
                                                ),
                                        );

                                        const item_data = {
                                            _key: nanoid(),
                                            title: data.title,
                                            description: data.description,
                                            currency: data.currency,
                                            ammount: Number(data.ammount),
                                            other: data.other,
                                            color: data.color,
                                            id: crypto.randomUUID(),
                                            frequency,
                                            type,
                                            ...(type === "commit"
                                                ? {
                                                      date2: data[
                                                          "date-untill"
                                                      ],
                                                      date1: data["date-from"],
                                                  }
                                                : { date1: data.date }),
                                        };

                                        setActions(prev=>[...prev, item_data]);
                                    }}
                                />
                            </div>
                        </TriggerProvider>
                    </div>
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
                            callback(title, currency, actions);
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

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.02,
            duration: 0.05,
            ease: "easeOut",
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0,
            duration: 0.02,
            ease: "easeOut",
        },
    },
};

const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            when: "afterChildren",
        },
    },
};

const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};
