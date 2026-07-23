"use client";

import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

interface Suggestion {
  code: string;
  name: string;
}

export interface SelectedPlace {
  /** IATA לטיסות, שם אנגלי למלונות. */
  code: string;
  /** תצוגה. */
  name: string;
}

/** יעד-סנטינל ל"לכל מקום" — מפעיל חיפוש Everywhere. */
export const ANYWHERE: SelectedPlace = { code: "ANYWHERE", name: "כל היעדים" };

export function LocationInput({
  label,
  placeholder,
  value,
  onSelect,
  kind = "flight",
  allowAnywhere = false,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onSelect: (place: SelectedPlace | null) => void;
  kind?: "flight" | "hotel";
  /** מציג אפשרות נעוצה "🌍 כל היעדים" בראש הרשימה (שדה "לאן" בלבד). */
  allowAnywhere?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setItems([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places?kind=${kind}&q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal },
        );
        const data = (await res.json()) as Suggestion[];
        setItems(Array.isArray(data) ? data : []);
      } catch {
        /* אבורט/רשת — מתעלמים */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, kind]);

  function pick(p: Suggestion) {
    setQuery(p.name);
    onSelect({ code: p.code, name: p.name });
    setItems([]);
    setOpen(false);
  }

  function pickAnywhere() {
    setQuery(`🌍 ${ANYWHERE.name}`);
    onSelect(ANYWHERE);
    setItems([]);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative flex flex-col gap-1 text-start">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-brand"
      />
      {open && (items.length > 0 || allowAnywhere) && (
        <ul className="absolute top-full z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-surface py-1 shadow-xl">
          {allowAnywhere && (
            <li>
              <button
                type="button"
                onClick={pickAnywhere}
                className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-start text-sm font-medium hover:bg-black/5"
              >
                <span aria-hidden>🌍</span>
                <span>כל היעדים — מצאו לי לאן זול לטוס</span>
              </button>
            </li>
          )}
          {items.map((p) => (
            <li key={`${p.code}-${p.name}`}>
              <button
                type="button"
                onClick={() => pick(p)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-sm hover:bg-black/5"
              >
                <span>{p.name}</span>
                <span className="shrink-0 text-xs font-medium text-muted">
                  {p.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
