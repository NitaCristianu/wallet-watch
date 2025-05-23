"use client";

import * as React from "react";
import { ReactDayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar({
  className,
  classNames,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  classNames?: React.ComponentProps<typeof ReactDayPicker>["classNames"];
}) {
  return (
    <div className={cn("rounded-md border", className)}>
      <ReactDayPicker
        mode="single"
        showOutsideDays
        disabled={{ before: new Date() }}
        modifiersClassNames={{
          selected: "bg-primary text-primary-foreground",
          disabled: "text-muted-foreground",
        }}
        {...props}
        classNames={{
          day: "h-9 w-9 rounded-md p-0 font-normal aria-selected:opacity-100",
          ...classNames,
        }}
      />
    </div>
  );
}
