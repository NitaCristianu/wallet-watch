"use client";
import {
  IonIosHome,
  MaterialSymbolsLightKeyboardArrowDownRounded,
  MaterialSymbolsLightSoundDetectionGlassBreakOutlineRounded,
  MaterialSymbolsMoneyBagRounded,
} from "@/constants/Icons";
import { action_type } from "@/constants/types";
import { useTrigger } from "@/utils/open-modal-utils";
import { motion, setStyle } from "framer-motion";
import { BadgePlus, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

const StaggeredDropDown = (params: {
  options: { Icon: any; text: action_type }[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8 z-2 pb-56 flex items-center justify-center">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((pv) => !pv)}
          className="flex items-center gap-2 max-sm:px-2 md:px-4 py-2  rounded-full md:rounded-lg text-indigo-50 bg-black-600 hover:bg-black-500 transition-colors cursor-pointer"
        >
          <span>
            <span className="font-medium max-sm:hidden">Create action</span>
            <Plus className="font-medium md:hidden"></Plus>
          </span>
          <motion.span variants={iconVariants} className="w-7 fill-current max-sm:hidden">
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
            <Option {...option} setOpen={setOpen} key={option.text} />
          ))}
        </motion.ul>
      </motion.div>
    </div>
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
      <motion.span variants={actionIconVariants} className="w-4 fill-current">
        {Icon}
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default function FloatingCreateButton({classname}:{classname?: string}) {
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

  return (
    <div className={classname || `fixed right-0 overflow-hidden mr-5`}>
      <StaggeredDropDown options={Options} />
    </div>
  );
}

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
      duration: 0.15,
      ease: "easeOut",
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      duration: 0.15,
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
