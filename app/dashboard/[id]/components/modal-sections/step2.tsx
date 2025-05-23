import { icons } from "@/constants";
import currencies from "@/constants/currencies";
import { MaterialSymbolsLightKeyboardArrowDownRounded } from "@/constants/Icons";
import { action_type, writeActionData } from "@/constants/types";
import { motion } from "framer-motion";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

function AmmountCurencyInput({
    data,
    className,
}: {
    data: writeActionData;
    className?: string;
}) {
    const [error, setError] = useState("Invalid Currency");
    const [showError, setShowError] = useState(false);
    const [inputRaw, setInputRaw] = useState(data.ammount?.toFixed(0)!);
    const [currency, setCurrency] = useState(data.currency || "EUR");
    const [ammount, setAmmount] = useState<number>(data.ammount || 0);

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
                <div
                    className={`mx-auto ${ammount >= 0 && inputRaw[0] != "-" ? (inputRaw.length > 0 && ammount != 0 ? "bg-accent-100 text-accent-900/40" : "bg-gray-200 text-text-tertiary") : "bg-red-100 text-red-900/40"} transition duration-200  shadow-xl bg-gradient-to-b to-black/3 rounded-xl gap-5`}
                >
                    <input
                        type="number"
                        name="ammount"
                        value={ammount === 0 && inputRaw === "" ? "" : ammount}
                        onChange={(e) => {
                            const val = e.target.value;
                            setInputRaw(val);
                            setAmmount(val === "" ? 0 : Number(val));
                        }}
                        className={`appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none h-full w-full outline-0 p-3 text-4xl `}
                    />
                </div>
                <div className="mx-auto bg-gray-200 shadow-xl bg-gradient-to-b to-black/3 rounded-xl text-text-tertiary gap-5">
                    <input
                        name="currency"
                        value={currency}
                        type="text"
                        className="h-full w-full outline-0 p-3 text-4xl "
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setCurrency(event.target.value);
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

function Showcase({ data }: { data: writeActionData }) {
    return (
        <div className="justify-center items-center text-gray-400 gap-2 pb-1 flex">
            <h1 className="text-xl font-semibold capitalize">{data.title}</h1>
            {icons[data.icon || "HiShoppingBag"]?.({
                className: "h-10 w-10 aspect-square mb-1",
            })}
        </div>
    );
}

function AdvancedOptions({
    data,
    color,
    title,
    description,
    other,
    date,
    daterange,
}: {
    color?: boolean;
    title?: boolean;
    description?: boolean;
    other?: boolean;
    date?: boolean;
    daterange?: boolean;
    data: writeActionData;
}) {
    const [openAdvanced, setOpenAdvanced] = useState(false);

    return (
        <>
            <motion.div
                className="flex mx-auto transition h-min items-center justify-center mt-4 text-text-tertiary hover:text-text-secondary w-min cursor-pointer pb-4"
                onTap={() => setOpenAdvanced((prev) => !prev)}
            >
                <p>Advanced</p>
                <motion.div animate={{ rotate: openAdvanced ? 0 : 180 }}>
                    <MaterialSymbolsLightKeyboardArrowDownRounded className="h-8" />
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: openAdvanced ? "auto" : "0px" }}
                className="flex flex-col items-center overflow-hidden cursor-default gap-4 flex-start text-left px-20"
            >
                {color == true ? (
                    <div className="w-full text-xl text-text-secondary flex gap-5 items-center">
                        Color
                        <div className="overflow-hidden rounded-full w-7 h-7">
                            <input
                                type="color"
                                name="color"
                                defaultValue={data.color || "#3190f0"}
                                className="w-14 h-14 -translate-2"
                            />
                        </div>
                    </div>
                ) : null}
                {title == true ? (
                    <div className="w-full text-xl text-text-secondary flex gap-5 items-center">
                        Title
                        <div className="rounded-xl overflow-hidden p-2 bg-gray-200 ">
                            <input
                                name="title"
                                placeholder="Name this transfer"
                                defaultValue={data.title!}
                                type="text"
                                className="outline-0 border-0"
                            />
                        </div>
                    </div>
                ) : null}
                {other == true ? (
                    <div className="w-full text-xl text-text-secondary flex gap-5 items-center">
                        From/To
                        <div className="rounded-xl overflow-hidden p-2 bg-gray-200 ">
                            <input
                                placeholder="Payee/Payer"
                                name="other"
                                type="text"
                                defaultValue={data.other!}
                                className="outline-0 border-0"
                            />
                        </div>
                    </div>
                ) : null}
                {date == true ? (
                    <div className="w-full text-xl text-text-secondary flex gap-5 items-center">
                        <p className="text-left">Date</p>
                        <div className="rounded-xl overflow-hidden p-2 bg-gray-200 ">
                            <input
                                defaultValue={
                                    new Date().toISOString().split("T")[0]
                                }
                                placeholder="short description"
                                type="date"
                                name="date"
                                className="outline-0 overflow-y-scroll border-0 scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300"
                            />
                        </div>
                    </div>
                ) : null}
                {daterange == true ? (
                    <div className="w-full text-xl text-text-secondary flex gap-5 items-center flex-wrap">
                        <div className="flex bg-gray-200 item-center justify-center rounded-xl p-2 gap-2">
                            <p className="text-left text-surface-900 self-center h-full">
                                From
                            </p>
                            <div className="overflow-hidden">
                                <input
                                    defaultValue={
                                        new Date().toISOString().split("T")[0]
                                    }
                                    placeholder="short description"
                                    type="date"
                                    name="date-from"
                                    className="outline-0 overflow-y-scroll border-0 w-min scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300"
                                />
                            </div>
                        </div>
                        <div className="flex bg-gray-200 item-center justify-center rounded-xl p-2 gap-2">
                            <p className="text-left text-surface-900 self-center h-full">
                                Untill
                            </p>
                            <div className="overflow-hidden">
                                <input
                                    defaultValue={
                                        new Date(
                                            new Date().setFullYear(
                                                new Date().getFullYear() + 1,
                                            ),
                                        )
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    placeholder="short description"
                                    type="date"
                                    name="date-untill"
                                    className="outline-0 overflow-y-scroll border-0 scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300"
                                />
                            </div>
                        </div>
                    </div>
                ) : null}
                {description == true ? (
                    <div className="w-full text-xl text-text-secondary flex flex-col gap-5 items-center">
                        <p className="text-left w-full">Description</p>
                        <div className="w-full h-30 rounded-xl overflow-hidden p-2 bg-gray-200">
                            <textarea
                                placeholder="short description"
                                name="description"
                                defaultValue={data.description || ""}
                                className="outline-0 border-0 w-full h-full resize-none text-left align-top"
                            />
                        </div>
                    </div>
                ) : null}
            </motion.div>
        </>
    );
}

function FrequencySlider({ data }: { data: writeActionData }) {
    const minDays = 1;
    const maxDays = 365;
    const sliderinitial = data.frequency! > 1 ? (100 * Math.log(data.frequency! / minDays)) / Math.log(maxDays / minDays) : 1;
    const [sliderRaw, setSliderRaw] = useState(sliderinitial); // 0 to 100

    const frequency = Math.round(
        minDays * Math.pow(maxDays / minDays, sliderRaw / 100),
    );

    const snapPoints = [7, 14, 30, 60, 90, 365];
    const tolerance = 2;

    return (
        <div className="w-4/5 mx-auto">
            <h1 className="text-2xl bg-gray-200 w-fit mx-auto p-3 rounded-2xl shadow-md mb-4 text-center">
                {" "}
                {frequency} Day{frequency > 1 ? "s" : ""}
            </h1>
            <input
                type="range"
                min={1}
                max={100}
                name="frequency"
                step={1}
                value={sliderRaw}
                onChange={(e) => setSliderRaw(Number(e.target.value))}
                className="w-full h-2 appearance-none bg-neutral-200 rounded-full outline-none
             accent-blue-600
             [&::-webkit-slider-thumb]:appearance-none
             [&::-webkit-slider-thumb]:w-4
             [&::-webkit-slider-thumb]:h-4
             [&::-webkit-slider-thumb]:bg-blue-600
             [&::-webkit-slider-thumb]:rounded-full
             [&::-webkit-slider-thumb]:shadow-md
             [&::-moz-range-thumb]:w-4
             [&::-moz-range-thumb]:h-4
             [&::-moz-range-thumb]:bg-blue-600
             [&::-moz-range-thumb]:rounded-full
             [&::-moz-range-thumb]:shadow-md"
            />
        </div>
    );
}

function CommitStep({ data }: { data: writeActionData }) {
    return (
        <>
            <Showcase data={data} />
            <motion.h1 className="text-4xl text-center px-10 text-nowrap">
                How{" "}
                {
                    <motion.span exit={{ scale: 0 }} className="font-[500]">
                        much
                    </motion.span>
                }{" "}
                are
                <br />
                we talking?
            </motion.h1>
            <div className="flex flex-col">
                <AmmountCurencyInput data={data} className="my-5" />
                <motion.h1 className="text-4xl text-center px-10 pb-3 text-nowrap">
                    and how{" "}
                    {
                        <motion.span exit={{ scale: 0 }} className="font-[500]">
                            often
                        </motion.span>
                    }
                    ?
                </motion.h1>
                <FrequencySlider data={data} />
                <AdvancedOptions
                    data={data}
                    title
                    description
                    other
                    daterange
                />
            </div>
        </>
    );
}

function TransferStep({ data }: { data: writeActionData }) {
    return (
        <>
            <Showcase data={data} />
            <motion.h1 className="text-5xl text-center px-10 pb-10 text-nowrap">
                How{" "}
                {
                    <motion.span exit={{ scale: 0 }} className="font-[500]">
                        much
                    </motion.span>
                }{" "}
                are
                <br />
                we talking?
            </motion.h1>
            <div className="flex flex-col">
                <AmmountCurencyInput data={data} />
                <AdvancedOptions data={data} title description other date />
            </div>
        </>
    );
}

function GoalStep({ data }: { data: writeActionData }) {
    return (
        <>
            <motion.h1 className="text-5xl text-center px-10 py-5 text-nowrap">
                What is your{" "}
                {data.type ? (
                    <motion.span exit={{ scale: 0 }} className="font-[500]">
                        goal
                    </motion.span>
                ) : null}
                ?
            </motion.h1>
            <AmmountCurencyInput data={data} />
            <AdvancedOptions title color description date data={data} />
        </>
    );
}

function Step2({
    setstep,
    data,
    callback,
    type,
}: {
    setstep: Dispatch<SetStateAction<number>>;
    data: writeActionData;
    type: action_type;
    callback: (data: Object, type: action_type) => void;
}) {
    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const values = Object.fromEntries(
                        new FormData(event.currentTarget),
                    );
                    callback(values, type);
                }}
            >
                <motion.div
                    exit={{ opacity: 0 }}
                    animate={{
                        opacity: 100,
                        transition: { delay: 0.1, duration: 0.4 },
                    }}
                    initial={{
                        opacity: 0,
                        transition: { duration: 0.6, delay: 0.2 },
                    }}
                >
                    {
                        {
                            transfer: <TransferStep data={data} />,
                            commit: <CommitStep data={data} />,
                            goal: <GoalStep data={data} />,
                        }[data.type!]
                    }
                </motion.div>

                <motion.button
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 font-semibold text-gray-200 bg-text-primary py-2 px-4 text-lg rounded-full cursor-pointer hover:bg-text-secondary transition mb-4"
                    onTap={() => {
                        setstep(2);
                    }}
                    type="submit"
                >
                    Continue
                </motion.button>
            </form>
        </>
    );
}

export default Step2;
