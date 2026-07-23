import type { FlightResult } from "@/lib/travel/types";
import { AirlineBadge, GateBadge } from "@/components/FlightBadges";
import { FlightItinerary } from "@/components/FlightItinerary";
import { PartnerLink } from "@/components/PartnerLink";
import { formatPrice } from "@/lib/travel/format";

export function FlightResultCard({ flight }: { flight: FlightResult }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      {/* שורה עליונה: חברה + מקור הזמנה · מחיר */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {flight.airline && <AirlineBadge code={flight.airline} />}
          {flight.gate && <GateBadge gate={flight.gate} />}
        </div>
        <div className="text-2xl font-bold leading-none">
          {formatPrice(flight.price, flight.currency)}
        </div>
      </div>

      {/* לוח זמנים מלא — הלוך + חזור עם שעות המראה ונחיתה */}
      <FlightItinerary flight={flight} />

      {/* CTA — ישירות לאתר השותף (handoff מתויג) */}
      <div className="flex justify-end">
        <PartnerLink
          href={flight.handoffUrl}
          kind="flight"
          destination={flight.destinationAirport}
          className="h-10 rounded-lg bg-brand px-6 text-sm font-semibold leading-10 text-brand-foreground transition-opacity hover:opacity-90"
        >
          המשך להזמנה
        </PartnerLink>
      </div>
    </article>
  );
}
