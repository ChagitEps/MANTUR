import type { FlightResult } from "@/lib/travel/types";

function formatPrice(price: number, currency: string): string {
  const symbol = currency.toLowerCase() === "ils" ? "₪" : "";
  return `${symbol}${price.toLocaleString("he-IL")}`;
}

function formatDeparture(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("he-IL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(min: number): string {
  if (!min) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}ש ${m}ד` : `${h}ש`;
}

function transfersLabel(n: number): string {
  if (n === 0) return "ישירה";
  if (n === 1) return "עצירה אחת";
  return `${n} עצירות`;
}

export function FlightResultCard({ flight }: { flight: FlightResult }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span>{flight.originAirport}</span>
          <span aria-hidden className="text-foreground/40">
            ←
          </span>
          <span>{flight.destinationAirport}</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-foreground/60">
          {flight.departureAt && <span>{formatDeparture(flight.departureAt)}</span>}
          <span>{transfersLabel(flight.transfers)}</span>
          {flight.durationMinutes > 0 && <span>{formatDuration(flight.durationMinutes)}</span>}
          {flight.airline && <span>חברה: {flight.airline}</span>}
          {flight.gate && <span>דרך {flight.gate}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-2xl font-bold">
          {formatPrice(flight.price, flight.currency)}
        </div>
        <a
          href={flight.handoffUrl}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="h-10 rounded-lg bg-brand px-6 text-sm font-semibold leading-10 text-brand-foreground transition-opacity hover:opacity-90"
        >
          המשך להזמנה
        </a>
      </div>
    </article>
  );
}
