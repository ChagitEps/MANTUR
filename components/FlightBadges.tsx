import { airlineLogo, airlineName } from "@/lib/travel/airlines";

/** לוגו + שם חברת התעופה. לוגו מ-pics.avs.io (לפי קוד IATA). */
export function AirlineBadge({ code }: { code: string }) {
  if (!code) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      {/* לוגו קטן — img רגיל (בלי אופטימייזר) כדי להימנע מכשל על קוד לא מוכר. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={airlineLogo(code)}
        alt=""
        width={18}
        height={18}
        loading="lazy"
        className="h-[18px] w-[18px] shrink-0 rounded-sm object-contain"
      />
      <span>{airlineName(code)}</span>
    </span>
  );
}

/** דומיין משוער של אתר ההזמנה לפי שם ה-gate (ל-favicon). */
function gateDomain(gate: string): string {
  const g = gate.trim().toLowerCase().replace(/\s+/g, "");
  return g.includes(".") ? g : `${g}.com`;
}

/** "דרך <אתר>" עם לוגו/favicon קטן של אתר ההזמנה. */
export function GateBadge({ gate }: { gate: string }) {
  if (!gate) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span>דרך</span>
      {/* favicon דרך שירות גוגל — תמיד מחזיר תמונה (globe אם לא ידוע). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
          gateDomain(gate),
        )}&sz=64`}
        alt=""
        width={14}
        height={14}
        loading="lazy"
        className="h-[14px] w-[14px] shrink-0 rounded-sm"
      />
      <span>{gate}</span>
    </span>
  );
}
