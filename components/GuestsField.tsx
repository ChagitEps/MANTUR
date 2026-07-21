"use client";

import { useRef, useState } from "react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

function Stepper({
  label,
  value,
  min = 1,
  max = 9,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-full border border-border text-lg leading-none disabled:opacity-40";
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`הפחת ${label}`}
          className={btn}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="w-5 text-center text-sm tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={`הוסף ${label}`}
          className={btn}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function GuestsField({
  adults,
  rooms = 1,
  withRooms = false,
  onChange,
}: {
  adults: number;
  rooms?: number;
  withRooms?: boolean;
  onChange: (v: { adults: number; rooms: number }) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const summary = withRooms
    ? `${rooms} חדרים · ${adults} אורחים`
    : `${adults} נוסעים`;

  return (
    <div ref={ref} className="relative flex flex-col gap-1 text-start">
      <span className="text-xs font-medium text-muted">
        {withRooms ? "חדרים ואורחים" : "נוסעים"}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-start text-sm"
      >
        {summary}
      </button>
      {open && (
        <div className="absolute top-full z-50 mt-1 w-64 rounded-xl border border-border bg-surface p-3 shadow-xl">
          {withRooms && (
            <Stepper
              label="חדרים"
              value={rooms}
              onChange={(v) => onChange({ adults, rooms: v })}
            />
          )}
          <Stepper
            label={withRooms ? "מבוגרים" : "נוסעים"}
            value={adults}
            onChange={(v) => onChange({ adults: v, rooms })}
          />
        </div>
      )}
    </div>
  );
}
