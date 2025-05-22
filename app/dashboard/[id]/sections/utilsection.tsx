"use client";
import { actionType, projectType } from "@/constants/types";
import { motion } from "framer-motion";

function Utilities({
    project,
    actions,
    currency,
}: {
    project: projectType;
    actions: actionType[];
    currency: string;
}) {
    return (
        <div className=" bg-accent-700 text-gray-100 flex justify-between items-center p-20 gap-10 max-sm:flex-col">
            <div>
                <h1 className="text-5xl md:text-8xl ">WalletWatch</h1>
                <p className="px-2 font-[200]">Simplifying your life.</p>
            </div>
            <div className="flex-col text-gray-100 gap-5 md:gap-2 flex max-sm:text-sm text-left">
                <motion.a
                    href={`/dashboard/${project._id}/history`}
                    className="bg-black-600 hover:bg-black-900 transition p-2 px-4 rounded-full cursor-pointer text-left"
                >
                    View history & Manage actions
                </motion.a>
                <motion.a
                    href={`/settings/${project._id}`}
                    className="bg-black-600 hover:bg-black-900 p-2 px-4 rounded-full transition cursor-pointer"
                >
                    Project Settings
                </motion.a>
                <motion.button
                    className="bg-black-600 hover:bg-black-900 p-2 px-4 rounded-full transition cursor-pointer text-left"
                    onClick={() => {
                        const data = [actions, project];
                        const blob = new Blob([JSON.stringify(data, null, 2)], {
                            type: "application/json",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "project.json";
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                >
                    Download as JSON
                </motion.button>
            </div>
        </div>
    );
}

export default Utilities;
