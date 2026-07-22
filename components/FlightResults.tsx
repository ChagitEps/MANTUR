"use client";

import { useMemo, useState } from "react";
import { FlightResultCard } from "@/components/FlightResultCard";
import { airlineName } from "@/lib/travel/airlines";
import type { FlightResult } from "@/lib/travel/types";

type StopBucket = "0" | "1" | "2+";

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

interface HrefParams {
  origin: string;
  destination: string;
  depart: string;
  return?: string;
  destName?: string;
}

/** תוצאות טיסות עם פאנל סינון (חברת תעופה + עצירות). סינון בצד לקוח. */
export function FlightResults({
  results,
  hrefParams,
}: {
  results: FlightResult[];
  hrefParams: HrefParams;
}) {
  const [airlineSel, setAirlineSel] = useState<Set<string>>(new Set());
  const [stopSel, setStopSel] = useState<Set<StopBucket>>(new Set());

  // חברות תעופה ייחודיות + ספירה (ממוין לפי כמות).
  const airlines = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of results) {
      if (!f.airline) continue;
      m.set(f.airline, (m.get(f.airline) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [results]);

  // סוגי עצירות שקיימים בתוצאות.
  const stopBuckets = useMemo(() => {
    const s = new Set<StopBucket>();
    for (const f of results) s.add(stopBucket(f.transfers));
    return (["0", "1", "2+"] as StopBucket[]).filter((b) => s.has(b));
  }, [results]);

  const filtered = useMemo(
    () =>
      results.filter((f) => {
        if (airlineSel.size > 0 && !airlineSel.has(f.airline)) return false;
        if (stopSel.size > 0 && !stopSel.has(stopBucket(f.transfers))) return false;
        return true;
      }),
    [results, airlineSel, stopSel],
  );

  function toggleAirline(code: string) {
    setAirlineSel((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }
  function toggleStop(b: StopBucket) {
    setStopSel((prev) => {
      const next = new Set(prev);
      next.has(b) ? next.delete(b) : next.add(b);
      return next;
    });
  }
  function clearAll() {
    setAirlineSel(new Set());
    setStopSel(new Set());
  }

  const hasFilters = airlineSel.size > 0 || stopSel.size > 0;
  const canFilter = stopBuckets.length > 1 || airlines.length > 1;

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
      {canFilter && (
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

            {stopBuckets.length > 1 && (
              <fieldset className="mb-4">
                <legend className="mb-2 text-xs font-medium text-muted">
                  עצירות
                </legend>
                <div className="flex flex-col gap-1.5">
                  {stopBuckets.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={stopSel.has(b)}
                        onChange={() => toggleStop(b)}
                        className="accent-brand"
                      />
                      {STOP_LABELS[b]}
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
                    <label
                      key={code}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={airlineSel.has(code)}
                        onChange={() => toggleAirline(code)}
                        className="accent-brand"
                      />
                      <span className="flex-1 truncate">{airlineName(code)}</span>
                      <span className="text-xs text-muted">{count}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        </aside>
      )}

      {/* רשימת תוצאות */}
      <div className="min-w-0 flex-1">
        <p className="mb-3 text-sm text-muted">
          {filtered.length} מתוך {results.length} טיסות
        </p>
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((f, i) => (
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
