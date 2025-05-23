"use client";
import { action_type } from "@/constants/types";
import { useTrigger } from "@/utils/open-modal-utils";
import { AnimatePresence, motion } from "framer-motion";
import { act, useEffect, useState } from "react";
import ActionDataPresets from "@/constants/ActionDataPresets";
import Step1 from "./modal-sections/step1";
import Step2 from "./modal-sections/step2";
import Step3 from "./modal-sections/step3";

export function useResponsiveModalWidth(action: boolean) {
    const [dimensions, setDimensions] = useState({ width: 0, minWidth: 0 });

    useEffect(() => {
        const update = () => {
            const isMobile = window.innerWidth < 768;

            if (!action) {
                setDimensions({ width: 0, minWidth: 0 });
                return;
            }

            setDimensions({
                width: isMobile ? window.innerWidth : window.innerWidth * 0.4,
                minWidth: isMobile ? window.innerWidth : 700,
            });
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [action]);

    return dimensions;
}

function FloatingModal({
    visible: action,
    servercallback,
    classname
}: {
    visible: action_type | null;
    classname?:string,
    servercallback: (data: Object, type: action_type) => void;
}) {
    const trigger = useTrigger();
    const [step, setstep] = useState(0);
    const [preset, stepreset] = useState(ActionDataPresets[0]);
    preset.type = action;
    const { width, minWidth } = useResponsiveModalWidth(action ? true : false);

    useEffect(() => {
        setstep(0);
    }, [action]);

    useEffect(() => {
        if (step > 2) trigger(null);
    }, [step]);

    return (
        <motion.div
            className={`bg-gray-100/50 h-screen w-screen max-md:w-screen md:h-[97%] backdrop-blur-xl top-1/2 -translate-y-1/2 rounded-2xl md:right-5 fixed flex flex-col justify-center overflow-hidden max-sm:left-0 ${classname}`}
            initial={{ width: 0, opacity: 0 }}
            animate={{
                width,
                minWidth,
                opacity: action ? 1 : 0,
                transition: { duration: 0.6, ease: "easeInOut" },
            }}
        >
            <motion.button
                type="button"
                className="absolute top-0 left-1/2 -translate-x-1/2 p-6 text-text-tertiary text-lg hover:text-text-secondary transition"
                onTap={() => (step < 2 ? trigger(null) : null)}
                animate={{ opacity: step < 2 ? 1 : 0 }}
            >
                Cancel
            </motion.button>
            {action ? (
                <AnimatePresence>
                    {step == 0 ? (
                        <Step1
                            action={action}
                            setstep={setstep}
                            setpreset={stepreset}
                        />
                    ) : null}
                    {step == 1 ? (
                        <Step2
                            type={action}
                            data={preset}
                            setstep={setstep}
                            callback={servercallback}
                        />
                    ) : null}
                    {step == 2 ? <Step3 setstep={setstep} /> : null}
                </AnimatePresence>
            ) : null}
        </motion.div>
    );
}

export default FloatingModal;
