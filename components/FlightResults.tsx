"use client";

import { useMemo, useState } from "react";
import { FlightResultCard } from "@/components/FlightResultCard";
import { AirlineBadge } from "@/components/FlightBadges";
import { formatPrice } from "@/lib/travel/format";
import type { FlightResult } from "@/lib/travel/types";

type StopBucket = "0" | "1" | "2+";
type TimeBucket = "night" | "morning" | "noon" | "evening";
type SortKey = "price" | "duration" | "departure";

function stopBucket(transfers: number): StopBucket {
  if (transfers <= 0) return "0";
  if (transfers === 1) return "1";
  return "2+";
}

const STOP_LABELS: Record<StopBucket, string> = {
  "0": "ישירה",
  "1": "עצירה אחת",
  "2+": "2 עצירות ומעלה",
};

function timeBucket(iso: string): TimeBucket {
  const h = new Date(iso).getHours();
  if (h < 6) return "night";
  if (h < 12) return "morning";
  if (h < 18) return "noon";
  return "evening";
}

const TIME_ORDER: TimeBucket[] = ["night", "morning", "noon", "evening"];
const TIME_LABELS: Record<TimeBucket, string> = {
  night: "לילה (00–06)",
  morning: "בוקר (06–12)",
  noon: "צהריים (12–18)",
  evening: "ערב (18–24)",
};

const SORTS: [SortKey, string][] = [
  ["price", "הכי זול"],
  ["duration", "הכי מהיר"],
  ["departure", "הכי מוקדם"],
];

interface HrefParams {
  origin: string;
  destination: string;
  depart: string;
  return?: string;
  destName?: string;
}

/** תוצאות טיסות עם סינון (מחיר/עצירות/שעה/חברה) ומיון. הכל בצד לקוח. */
export function FlightResults({
  results,
  hrefParams,
}: {
  results: FlightResult[];
  hrefParams: HrefParams;
}) {
  const priceBounds = useMemo(() => {
    const prices = results.map((f) => f.price).filter((p) => p > 0);
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    };
  }, [results]);

  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [airlineSel, setAirlineSel] = useState<Set<string>>(new Set());
  const [stopSel, setStopSel] = useState<Set<StopBucket>>(new Set());
  const [timeSel, setTimeSel] = useState<Set<TimeBucket>>(new Set());
  const [sort, setSort] = useState<SortKey>("price");

  const airlines = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of results) {
      if (!f.airline) continue;
      m.set(f.airline, (m.get(f.airline) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [results]);

  const stopBuckets = useMemo(() => {
    const s = new Set<StopBucket>();
    for (const f of results) s.add(stopBucket(f.transfers));
    return (["0", "1", "2+"] as StopBucket[]).filter((b) => s.has(b));
  }, [results]);

  const timeBuckets = useMemo(() => {
    const s = new Set<TimeBucket>();
    for (const f of results) if (f.departureAt) s.add(timeBucket(f.departureAt));
    return TIME_ORDER.filter((b) => s.has(b));
  }, [results]);

  const visible = useMemo(() => {
    const filtered = results.filter((f) => {
      if (f.price > 0 && f.price > maxPrice) return false;
      if (airlineSel.size > 0 && !airlineSel.has(f.airline)) return false;
      if (stopSel.size > 0 && !stopSel.has(stopBucket(f.transfers))) return false;
      if (
        timeSel.size > 0 &&
        (!f.departureAt || !timeSel.has(timeBucket(f.departureAt)))
      )
        return false;
      return true;
    });
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "duration") {
        // משך לא ידוע (0) נדחף לסוף.
        const da = a.durationMinutes || Infinity;
        const db = b.durationMinutes || Infinity;
        return da - db;
      }
      return (
        new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
      );
    });
    return sorted;
  }, [results, maxPrice, airlineSel, stopSel, timeSel, sort]);

  function toggle<T>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, val: T) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });
  }
  function clearAll() {
    setMaxPrice(priceBounds.max);
    setAirlineSel(new Set());
    setStopSel(new Set());
    setTimeSel(new Set());
  }

  const hasFilters =
    maxPrice < priceBounds.max ||
    airlineSel.size > 0 ||
    stopSel.size > 0 ||
    timeSel.size > 0;
  const showPrice = priceBounds.max > priceBounds.min;

  function buildHref(f: FlightResult): string {
    const dp = new URLSearchParams({
      origin: hrefParams.origin,
      destination: hrefParams.destination,
      depart: hrefParams.depart,
      fid: f.id,
    });
    if (hrefParams.destName) dp.set("destName", hrefParams.destName);
    if (hrefParams.return) dp.set("return", hrefParams.return);
    return `/flights/detail?${dp.toString()}`;
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      {/* פאנל פילטרים */}
      <aside className="sm:w-56 sm:shrink-0">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">סינון</h2>
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-brand hover:underline"
              >
                נקה
              </button>
            )}
          </div>

          {showPrice && (
            <fieldset className="mb-4">
              <legend className="mb-2 text-xs font-medium text-muted">
                מחיר עד {formatPrice(maxPrice, "ils")}
              </legend>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand"
                aria-label="מחיר מקסימלי"
              />
              <div className="flex justify-between text-[11px] text-muted">
                <span>{formatPrice(priceBounds.min, "ils")}</span>
                <span>{formatPrice(priceBounds.max, "ils")}</span>
              </div>
            </fieldset>
          )}

          {stopBuckets.length > 1 && (
            <fieldset className="mb-4">
              <legend className="mb-2 text-xs font-medium text-muted">עצירות</legend>
              <div className="flex flex-col gap-1.5">
                {stopBuckets.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={stopSel.has(b)}
                      onChange={() => toggle(setStopSel, b)}
                      className="accent-brand"
                    />
                    {STOP_LABELS[b]}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {timeBuckets.length > 1 && (
            <fieldset className="mb-4">
              <legend className="mb-2 text-xs font-medium text-muted">
                שעת יציאה
              </legend>
              <div className="flex flex-col gap-1.5">
                {timeBuckets.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={timeSel.has(b)}
                      onChange={() => toggle(setTimeSel, b)}
                      className="accent-brand"
                    />
                    {TIME_LABELS[b]}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {airlines.length > 1 && (
            <fieldset>
              <legend className="mb-2 text-xs font-medium text-muted">
                חברת תעופה
              </legend>
              <div className="flex max-h-60 flex-col gap-1.5 overflow-auto">
                {airlines.map(([code, count]) => (
                  <label key={code} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={airlineSel.has(code)}
                      onChange={() => toggle(setAirlineSel, code)}
                      className="accent-brand"
                    />
                    <span className="flex-1 truncate">
                      <AirlineBadge code={code} />
                    </span>
                    <span className="text-xs text-muted">{count}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </aside>

      {/* רשימת תוצאות */}
      <div className="min-w-0 flex-1">
        {/* מיון + ספירה */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted">
            {visible.length} מתוך {results.length} טיסות
          </p>
          <div
            role="group"
            aria-label="מיון"
            className="inline-flex rounded-lg border border-border p-0.5 text-sm"
          >
            {SORTS.map(([val, label]) => (
              <button
                key={val}
                type="button"
                aria-pressed={sort === val}
                onClick={() => setSort(val)}
                className={`rounded-md px-3 py-1 transition-colors ${
                  sort === val
                    ? "bg-brand font-medium text-brand-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="flex flex-col gap-3">
            {visible.map((f, i) => (
              <FlightResultCard
                key={`${f.id}-${i}`}
                flight={f}
                detailHref={buildHref(f)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">אין טיסות שתואמות את הסינון.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-2 text-sm text-brand hover:underline"
            >
              ניקוי הסינון
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
