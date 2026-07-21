"use client";

import { useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { he } from "date-fns/locale";
import "react-day-picker/style.css";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

function fmt(d?: Date): string {
  return d
    ? d.toLocaleDateString("he-IL", { day: "numeric", month: "short" })
    : "";
}

export function DateRangeField({
  range,
  onChange,
  fromLabel,
  toLabel,
}: {
  range: DateRange | undefined;
  onChange: (r: DateRange | undefined) => void;
  fromLabel: string;
  toLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const trigger = (label: string, d?: Date) => (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex h-11 w-full flex-col justify-center rounded-lg border border-border bg-surface px-3 text-start"
    >
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-sm">{fmt(d) || "בחרו תאריך"}</span>
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <div className="grid grid-cols-2 gap-2">
        {trigger(fromLabel, range?.from)}
        {trigger(toLabel, range?.to)}
      </div>
      {open && (
        <div className="absolute top-full z-50 mt-2 rounded-xl border border-border bg-surface p-2 shadow-xl">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={(r) => {
              onChange(r);
              if (r?.from && r?.to) setOpen(false);
            }}
            locale={he}
            dir="rtl"
            numberOfMonths={1}
            disabled={{ before: today }}
          />
        </div>
      )}
    </div>
  );
}
