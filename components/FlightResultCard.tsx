import Link from "next/link";
import type { FlightResult } from "@/lib/travel/types";
import { AirlineBadge } from "@/components/FlightBadges";
import {
  formatDateTime,
  formatDuration,
  formatPrice,
  transfersLabel,
} from "@/lib/travel/format";

export function FlightResultCard({
  flight,
  detailHref,
}: {
  flight: FlightResult;
  detailHref: string;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span>{flight.originAirport}</span>
          <span aria-hidden className="text-muted">
            ←
          </span>
          <span>{flight.destinationAirport}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {flight.airline && <AirlineBadge code={flight.airline} />}
          {flight.departureAt && <span>{formatDateTime(flight.departureAt)}</span>}
          <span>{transfersLabel(flight.transfers)}</span>
          {flight.durationMinutes > 0 && <span>{formatDuration(flight.durationMinutes)}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-2xl font-bold">
          {formatPrice(flight.price, flight.currency)}
        </div>
        <Link
          href={detailHref}
          className="h-10 rounded-lg bg-brand px-6 text-sm font-semibold leading-10 text-brand-foreground transition-opacity hover:opacity-90"
        >
          צפייה בפרטים
        </Link>
      </div>
    </article>
  );
}
