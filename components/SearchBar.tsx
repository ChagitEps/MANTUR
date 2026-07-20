"use client";

import { useState } from "react";

type Scope = "abroad" | "domestic";
type Tab = "flights" | "hotels";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-start">
      <span className="text-xs font-medium text-foreground/60">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 rounded-lg border border-black/15 bg-background px-3 text-sm outline-none focus:border-foreground/50 dark:border-white/15";

export function SearchBar() {
  const [scope, setScope] = useState<Scope>("abroad");
  const [tab, setTab] = useState<Tab>("flights");

  // במצב "בארץ" אין טיסות — כופה לשונית מלונות ומסתיר את "טיסות".
  const effectiveTab: Tab = scope === "domestic" ? "hotels" : tab;

  function handleScope(next: Scope) {
    setScope(next);
    if (next === "domestic") setTab("hotels");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: לחבר לשכבת ה-Provider של Travelpayouts (ראה skill: mantur-backend).
  }

  return (
    <div className="w-full rounded-2xl border border-black/10 bg-background p-4 shadow-lg sm:p-5 dark:border-white/10">
      {/* טוגל חו"ל / בארץ */}
      <div
        role="group"
        aria-label="יעד החיפוש"
        className="mb-4 inline-flex rounded-full border border-black/10 p-1 dark:border-white/10"
      >
        {(
          [
            ["abroad", "חו״ל"],
            ["domestic", "בארץ"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={scope === value}
            onClick={() => handleScope(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              scope === value
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* לשוניות */}
      <div role="tablist" aria-label="סוג חיפוש" className="mb-4 flex gap-1">
        {scope === "abroad" && (
          <button
            role="tab"
            type="button"
            aria-selected={effectiveTab === "flights"}
            onClick={() => setTab("flights")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              effectiveTab === "flights"
                ? "bg-black/5 dark:bg-white/10"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            טיסות
          </button>
        )}
        <button
          role="tab"
          type="button"
          aria-selected={effectiveTab === "hotels"}
          onClick={() => setTab("hotels")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            effectiveTab === "hotels"
              ? "bg-black/5 dark:bg-white/10"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          מלונות
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {effectiveTab === "flights" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="מאיפה">
              <input className={inputClass} placeholder="תל אביב (TLV)" />
            </Field>
            <Field label="לאן">
              <input className={inputClass} placeholder="יעד או ״לכל מקום״" />
            </Field>
            <Field label="יציאה">
              <input type="date" className={inputClass} />
            </Field>
            <Field label="חזרה">
              <input type="date" className={inputClass} />
            </Field>
            <Field label="נוסעים">
              <input type="number" min={1} defaultValue={1} className={inputClass} />
            </Field>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="יעד">
              <input
                className={inputClass}
                placeholder={scope === "domestic" ? "עיר או אזור בארץ" : "עיר או מלון"}
              />
            </Field>
            <Field label="צ׳ק-אין">
              <input type="date" className={inputClass} />
            </Field>
            <Field label="צ׳ק-אאוט">
              <input type="date" className={inputClass} />
            </Field>
            <Field label="אורחים">
              <input type="number" min={1} defaultValue={2} className={inputClass} />
            </Field>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-foreground/50">החיפוש יחובר לספקים בשלב הבא.</p>
          <button
            type="submit"
            className="h-11 rounded-lg bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            חיפוש
          </button>
        </div>
      </form>
    </div>
  );
}
