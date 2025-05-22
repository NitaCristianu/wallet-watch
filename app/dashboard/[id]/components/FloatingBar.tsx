import React from "react";

const timePeriods = ["day", "month", "6 months", "year"]

function FloatingBar() {
    return (<div className="-translate-x-1/2 mt-10 left-1/2 absolute backdrop-blur-xl bg-surface-300/40 -px-4 border-1 border-surface-400 rounded-full flex  justify-evenly overflow-hidden">
        <div className="flex justify-evenly grow">
            {timePeriods.map((period, i) => (
                <button key={i} className="p-2 px-4 border-surface-400 border-l-1 text-center text-text-secondary cursor-pointer hover:bg-surface-400 hover:text-text-tertiary transition">{period}</button>
            ))}
        </div>
    </div>
    );
}

export default FloatingBar;