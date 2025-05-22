import { icons } from "@/constants";
import ActionDataPresets from "@/constants/ActionDataPresets";
import { action_type, writeActionData } from "@/constants/types";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const AnimatedCheckmark = () => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
        className="mx-auto w-30 h-30"
    >
        <motion.circle
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1.2 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        <motion.path
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 27l7 7 17-17"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.4 }}
        />
    </motion.svg>
);


function Step3({ setstep }: { setstep: Dispatch<SetStateAction<number>> }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            setstep(3);
        }, 1700);

        return () => clearTimeout(timer);
    }, [setstep]);


    return <motion.div exit={{ opacity: 0 }} animate={{ opacity: 100, transition: { delay: 0.1, duration: .4 } }} initial={{ opacity: 0, transition: { duration: .6, delay: .2 } }} className="text-text-primary">
        <AnimatedCheckmark />
        <motion.h1 className="text-5xl text-center p-10 text-nowrap">You're all set!</motion.h1>
    </motion.div>
};
export default Step3;