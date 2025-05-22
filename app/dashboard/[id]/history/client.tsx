"use client";

import { MaterialSymbolsLightArrowRightAltRounded } from "@/constants/Icons";
import { actionType } from "@/constants/types";
import { Trash } from "lucide-react";
import { useState } from "react";

const colors = {
    transfer: "#ff2d55",
    goal: "#007aff",
    commit: "#ff9500",
};

function ClientHistory({
    actions,
    callback,
    projectId,
}: {
    actions: actionType[];
    callback: (ids: string[], project: string) => void;
    projectId: string;
}) {
    const [selected, setSelected] = useState<string[]>([]);
    return (
        <>
            <form
                className="card flex flex-col w-[90vw] md:w-[50vw] p-5 gap-7 h-[60vh] overflow-auto scrollbar-min scroll-smooth dark"
                action={async () => callback(selected, projectId)}
            >
                <button
                    className="cursor-pointer bg-black-800 rounded-full w-fit mx-auto text-gray-100 py-1 px-5 flex gap-2 items-center justify-center text-lg hover:bg-red-800 duration-300 transition"
                    type="submit"
                >
                    <p>DELETE SELECTED</p>{" "}
                    <Trash className="stroke-current scale-80" />{" "}
                </button>
                {...actions
                    .sort(
                        (a, b) =>
                            new Date(a.date1 || "").getTime() -
                            new Date(b.date1 || "").getTime(),
                    )
                    .map((action, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="flex max-sm:text-xs items-center gap-1">
                                <div className="mr-10">
                                    <h1 className="text-lg">{action.title}</h1>
                                    <h4 className="font-light">
                                        {action.type}
                                    </h4>
                                </div>
                                <h4 className="font-light text-nowrap text-blue-400">
                                    {action.date1}
                                </h4>
                                {action.date2 || action.type == "commit" ? (
                                    <div className="flex w-full">
                                        <h4 className="font-light w-full text-nowrap text-blue-400">
                                            {">"} {action.date2}
                                        </h4>
                                    </div>
                                ) : null}
                            </div>
                            <input
                                className="-translate-[5%] border-0 outline-0 scale w-10 h-10 border-white rounded-full overflow-hidden scale-50"
                                type="checkbox"
                                onChange={() => {
                                    setSelected((prev: string[]) => {
                                        if (prev.includes(action.id!)) {
                                            return prev.filter(
                                                (val) => val !== action.id,
                                            );
                                        } else {
                                            return [...prev, action.id!];
                                        }
                                    });
                                }}
                            />
                        </div>
                    ))}
            </form>
        </>
    );
}

export default ClientHistory;
