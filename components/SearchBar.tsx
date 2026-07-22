"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { getTravelProvider } from "@/providers/travelpayouts";
import type { Scope } from "@/lib/travel/types";
import { LocationInput, type SelectedPlace } from "@/components/LocationInput";
import { DateRangeField } from "@/components/DateRangeField";
import { GuestsField } from "@/components/GuestsField";
import { trackSearch, trackPartnerClick } from "@/lib/analytics/track";

type Tab = "flights" | "hotels";

function toISO(d: Date): string {
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
}

const DEFAULT_ORIGIN: SelectedPlace = { code: "TLV", name: "תל אביב" };

export function SearchBar({
  initialDestination,
}: {
  /** יעד מוגדר מראש (למשל בעמוד יעד). */
  initialDestination?: SelectedPlace;
} = {}) {
  const router = useRouter();
  const [scope, setScope] = useState<Scope>("abroad");
  const [tab, setTab] = useState<Tab>("flights");
  const [error, setError] = useState<string | null>(null);

  const [origin, setOrigin] = useState<SelectedPlace | null>(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState<SelectedPlace | null>(
    initialDestination ?? null,
  );
  const [range, setRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // במצב "בארץ" אין טיסות — כופה מלונות ומסתיר את "טיסות".
  const effectiveTab: Tab = scope === "domestic" ? "hotels" : tab;

  function handleScope(next: Scope) {
    setScope(next);
    setError(null);
    if (next === "domestic") setTab("hotels");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (effectiveTab === "flights") {
      if (!origin?.code || !destination?.code || !range?.from) {
        setError("יש לבחור מוצא, יעד ותאריך יציאה.");
        return;
      }
      const params = new URLSearchParams({
        origin: origin.code,
        destination: destination.code,
        destName: destination.name,
        depart: toISO(range.from),
        adults: String(adults),
      });
      if (children > 0) params.set("children", String(children));
      if (range.to) params.set("return", toISO(range.to));
      trackSearch("flight", {
        origin: origin.code,
        destination: destination.code,
        depart: toISO(range.from),
        return: range.to ? toISO(range.to) : "",
      });
      router.push(`/flights?${params.toString()}`);
      return;
    }

    // מלונות: handoff מתויג לשותף (Booking דרך Travelpayouts).
    // Hotellook נסגר (אוקטובר 2025) — עמוד תוצאות משלנו ממתין לספק מלונות עם API.
    if (!destination?.code || !range?.from || !range?.to) {
      setError("יש לבחור יעד, צ׳ק-אין וצ׳ק-אאוט.");
      return;
    }
    const url = getTravelProvider().hotelSearchUrl({
      destination: destination.code,
      checkIn: toISO(range.from),
      checkOut: toISO(range.to),
      adults,
      rooms,
      children,
    });
    trackSearch("hotel", {
      destination: destination.code,
      depart: toISO(range.from),
      return: toISO(range.to),
    });
    trackPartnerClick("hotel", { destination: destination.code });
    window.open(url, "_blank", "noopener");
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-4 shadow-lg sm:p-5">
      {/* טוגל חו"ל / בארץ */}
      <div
        role="group"
        aria-label="יעד החיפוש"
        className="mb-4 inline-flex rounded-full border border-border p-1"
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
                ? "bg-brand text-brand-foreground"
                : "text-muted hover:text-foreground"
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
            onClick={() => {
              setTab("flights");
              setError(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              effectiveTab === "flights"
                ? "bg-black/5 text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            טיסות
          </button>
        )}
        <button
          role="tab"
          type="button"
          aria-selected={effectiveTab === "hotels"}
          onClick={() => {
            setTab("hotels");
            setError(null);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            effectiveTab === "hotels"
              ? "bg-black/5 text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          מלונות
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {effectiveTab === "flights" ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <LocationInput
                label="מאיפה"
                placeholder="עיר או שדה תעופה"
                value={DEFAULT_ORIGIN.name}
                onSelect={setOrigin}
                kind="flight"
              />
              <LocationInput
                label="לאן"
                placeholder="עיר או שדה תעופה"
                value={initialDestination?.name ?? ""}
                onSelect={setDestination}
                kind="flight"
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <DateRangeField
                  range={range}
                  onChange={setRange}
                  fromLabel="יציאה"
                  toLabel="חזרה"
                />
              </div>
              <GuestsField
                adults={adults}
                children={children}
                onChange={({ adults, children }) => {
                  setAdults(adults);
                  setChildren(children);
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <LocationInput
                label="יעד"
                placeholder={scope === "domestic" ? "עיר או אזור בארץ" : "עיר או מלון"}
                value={initialDestination?.name ?? ""}
                onSelect={setDestination}
                kind="hotel"
              />
              <GuestsField
                adults={adults}
                children={children}
                rooms={rooms}
                withRooms
                onChange={({ adults, children, rooms }) => {
                  setAdults(adults);
                  setChildren(children);
                  setRooms(rooms);
                }}
              />
            </div>
            <div className="mt-3">
              <DateRangeField
                range={range}
                onChange={setRange}
                fromLabel="צ׳ק-אין"
                toLabel="צ׳ק-אאוט"
              />
            </div>
          </>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {effectiveTab === "flights"
              ? "התוצאות יוצגו כאן באתר."
              : "מלונות: מעבר לאתר השותף (Booking) עם ה-marker."}
          </p>
          <button
            type="submit"
            className="h-11 rounded-lg bg-brand px-8 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            חיפוש
          </button>
        </div>
      </form>
    </div>
  );
}
