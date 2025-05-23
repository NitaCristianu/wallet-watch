import { icons } from "@/constants";
import ActionDataPresets from "@/constants/ActionDataPresets";
import { action_type, writeActionData } from "@/constants/types";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

function Step1({
    action,
    setstep,
    setpreset,
}: {
    action: action_type | null;
    setstep: Dispatch<SetStateAction<number>>;
    setpreset: Dispatch<SetStateAction<writeActionData>>;
}) {
    const items = ActionDataPresets.filter((data) => data.type == action);
    const [dragging, setDragging] = useState(false);

    return (
        <motion.div
            exit={{ opacity: 0, transition: { duration: 1 } }}
            animate={{ opacity: 100 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
        >
            <motion.h1 className="text-3xl md:text-4xl lg:text-5xl text-center p-10 text-nowrap">
                What kind of{" "}
                {action ? (
                    <motion.span exit={{ scale: 0 }} className="font-[500]">
                        {action}
                    </motion.span>
                ) : null}
                <br /> is it?
            </motion.h1>

            <div className="-z-10 py-20 -my-20 overflow-hidden h-full w-full">
                <motion.div className="grid grid-cols-2 px-15 overflow-y-scroll w-full h-[60vh] to-black/10 ">
                    {items.map((data) => (
                        <motion.div
                            className={`max-sm:aspect-square lg:aspect-square  rounded-xl bg-gradient-to-b to-black/14 p-4 shadow-xl hover:scale-105 m-3 hover:to-black/30 transition duration-300`}
                            style={{ backgroundColor: data.color ?? "#ccc" }}
                            key={data.title}
                            onTap={() => {
                                setstep((prev) => 1);
                                setpreset(data);
                            }}
                        >
                            <div className="max-sm:hidden md:w-4 lg:w-12 ml-5 mt-5 -mb-10 text-gray-200">
                                {icons[data.icon || "HiShoppingBag"]?.({
                                    className: "w-full h-full",
                                })}
                            </div>
                            <div className="flex justify-between h-full md:p-2">
                                <div className="flex flex-col w-full h-full justify-end pb-2">
                                    <h1 className=" text-gray-200 md:text-xs lg:text-2xl capitalize font-semibold">
                                        {data.title}
                                    </h1>
                                    <p className=" text-gray-200/70 text-sm capitalize">
                                        {data.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}
export default Step1;
