"use client";

import { useEffect, useRef, useState } from "react";
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
  const [months, setMonths] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  // בדסקטופ מציגים 2 חודשים (כמו אתרי טיסות אמיתיים), במובייל 1.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setMonths(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // התיבה הפעילה: אם אין יציאה → יציאה; אם יש יציאה בלי חזרה → חזרה.
  const activeField: "from" | "to" = range?.from && !range?.to ? "to" : "from";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const trigger = (label: string, d: Date | undefined, field: "from" | "to") => (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-pressed={open && activeField === field}
      className={`flex h-11 w-full flex-col justify-center rounded-lg border bg-surface px-3 text-start transition-colors ${
        open && activeField === field ? "border-brand ring-1 ring-brand" : "border-border"
      }`}
    >
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-sm">{fmt(d) || "בחרו תאריך"}</span>
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <div className="grid grid-cols-2 gap-2">
        {trigger(fromLabel, range?.from, "from")}
        {trigger(toLabel, range?.to, "to")}
      </div>
      {open && (
        <div className="absolute top-full z-50 mt-2 max-w-[calc(100vw-2rem)] overflow-x-auto rounded-xl border border-border bg-surface p-2 shadow-xl">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={(r) => {
              onChange(r);
              // נסגר רק כשגם יציאה וגם חזרה נבחרו — אחרת נשאר פתוח וממתין לחזרה.
              if (r?.from && r?.to) setOpen(false);
            }}
            locale={he}
            dir="rtl"
            numberOfMonths={months}
            disabled={{ before: today }}
          />
        </div>
      )}
    </div>
  );
}
