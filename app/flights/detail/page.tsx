import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AirlineBadge, GateBadge } from "@/components/FlightBadges";
import { PartnerLink } from "@/components/PartnerLink";
import { searchFlights } from "@/providers/travelpayouts/data";
import {
  formatDateTime,
  formatDuration,
  formatPrice,
  transfersLabel,
} from "@/lib/travel/format";

export const metadata: Metadata = {
  title: "פרטי טיסה — MANTUR",
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

function Leg({
  title,
  from,
  to,
  at,
  transfers,
  duration,
  airline,
}: {
  title: string;
  from: string;
  to: string;
  at: string;
  transfers: number;
  duration: number;
  airline?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 text-sm font-medium text-muted">{title}</div>
      <div className="flex items-center gap-2 text-xl font-semibold">
        <span>{from}</span>
        <span aria-hidden className="text-muted">
          ←
        </span>
        <span>{to}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        {airline && <AirlineBadge code={airline} />}
        {at && <span>{formatDateTime(at)}</span>}
        <span>{transfersLabel(transfers)}</span>
        {duration > 0 && <span>{formatDuration(duration)}</span>}
      </div>
    </div>
  );
}

export default async function FlightDetailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const origin = one(sp.origin).toUpperCase();
  const destination = one(sp.destination).toUpperCase();
  const departDate = one(sp.depart);
  const returnDate = one(sp.return) || undefined;
  const fid = one(sp.fid);

  let flight = null;
  if (origin && destination && departDate && fid) {
    try {
      const results = await searchFlights({
        origin,
        destination,
        departDate,
        returnDate,
      });
      flight = results.find((f) => f.id === fid) ?? null;
    } catch {
      flight = null;
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <Link
          href={`/flights?origin=${origin}&destination=${destination}&depart=${departDate}${returnDate ? `&return=${returnDate}` : ""}`}
          className="mb-4 inline-block text-sm text-brand hover:underline"
        >
          → חזרה לתוצאות
        </Link>

        {!flight ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">הטיסה כבר לא זמינה.</p>
            <p className="mt-1 text-sm text-muted">
              המחירים מתעדכנים — חזרו לתוצאות ובחרו טיסה מעודכנת.
            </p>
          </div>
        ) : (
          <>
            <h1 className="mb-4 text-2xl font-bold">
              פרטי טיסה {flight.originAirport} ← {flight.destinationAirport}
            </h1>

            <div className="flex flex-col gap-3">
              <Leg
                title="הלוך"
                from={flight.originAirport}
                to={flight.destinationAirport}
                at={flight.departureAt}
                transfers={flight.transfers}
                duration={flight.durationMinutes}
                airline={flight.airline}
              />
              {flight.returnAt && (
                <Leg
                  title="חזור"
                  from={flight.destinationAirport}
                  to={flight.originAirport}
                  at={flight.returnAt}
                  transfers={flight.returnTransfers ?? 0}
                  duration={flight.returnDurationMinutes ?? 0}
                  airline={flight.airline}
                />
              )}
            </div>

            <div className="mt-5 flex flex-col items-stretch gap-3 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs text-muted">מחיר החל מ-</div>
                <div className="text-3xl font-bold">
                  {formatPrice(flight.price, flight.currency)}
                </div>
                {flight.gate && (
                  <div className="mt-0.5">
                    <GateBadge gate={flight.gate} />
                  </div>
                )}
              </div>
              <PartnerLink
                href={flight.handoffUrl}
                kind="flight"
                destination={flight.destinationAirport}
                className="h-12 rounded-lg bg-brand px-8 text-center text-sm font-semibold leading-[3rem] text-brand-foreground transition-opacity hover:opacity-90"
              >
                המשך להזמנה
              </PartnerLink>
            </div>

            <p className="mt-3 text-xs text-muted">
              השוואת המחירים הסופית וההזמנה מתבצעות באתר השותף. המחיר כאן
              אינדיקטיבי.
            </p>
          </>
        )}
      </main>
    </>
  );
}
