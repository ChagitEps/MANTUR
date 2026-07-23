import type { FlightResult } from "@/lib/travel/types";
import { getAirportTz } from "@/lib/travel/airport-coords";
import {
  arrivalTime,
  formatDuration,
  formatShortDate,
  localTime,
  transfersLabel,
} from "@/lib/travel/format";

/** רגל טיסה בודדת: שעת המראה + שדה מוצא → משך/עצירות → שעת נחיתה + שדה יעד. */
function Leg({
  label,
  date,
  depTime,
  depCode,
  arr,
  arrCode,
  durationMin,
  transfers,
}: {
  label: string;
  date: string;
  depTime: string;
  depCode: string;
  arr: { time: string; dayOffset: number } | null;
  arrCode: string;
  durationMin: number;
  transfers: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-medium text-muted">
        {label}
        {date ? ` · ${date}` : ""}
      </div>
      <div className="flex items-center gap-3">
        {/* המראה */}
        <div className="min-w-12 text-start">
          <div className="text-lg font-semibold leading-tight">
            {depTime || "—"}
          </div>
          <div className="text-xs text-muted">{depCode}</div>
        </div>

        {/* קו מחבר: משך + עצירות */}
        <div className="flex flex-1 flex-col items-center">
          {durationMin > 0 && (
            <div className="text-[11px] text-muted">
              {formatDuration(durationMin)}
            </div>
          )}
          <div className="my-0.5 flex w-full items-center gap-1 text-muted/70">
            <span className="h-px flex-1 bg-border" />
            <span aria-hidden>✈</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="text-[11px] text-muted">{transfersLabel(transfers)}</div>
        </div>

        {/* נחיתה */}
        <div className="min-w-12 text-end">
          <div className="text-lg font-semibold leading-tight">
            {arr ? arr.time : "—"}
            {arr && arr.dayOffset > 0 && (
              <sup className="ms-0.5 align-super text-[10px] font-normal text-brand">
                +{arr.dayOffset}
              </sup>
            )}
          </div>
          <div className="text-xs text-muted">{arrCode}</div>
        </div>
      </div>
    </div>
  );
}

/** לוח זמנים מלא של הטיסה — הלוך (+חזור אם קיים) עם שעות המראה ונחיתה. */
export function FlightItinerary({ flight }: { flight: FlightResult }) {
  const outArr = arrivalTime(
    flight.departureAt,
    flight.durationMinutes,
    getAirportTz(flight.destinationAirport),
  );
  const retArr = flight.returnAt
    ? arrivalTime(
        flight.returnAt,
        flight.returnDurationMinutes ?? 0,
        getAirportTz(flight.originAirport),
      )
    : null;

  return (
    <div className="flex flex-col divide-y divide-border">
      <div className="pb-3">
        <Leg
          label="הלוך"
          date={formatShortDate(flight.departureAt)}
          depTime={localTime(flight.departureAt)}
          depCode={flight.originAirport}
          arr={outArr}
          arrCode={flight.destinationAirport}
          durationMin={flight.durationMinutes}
          transfers={flight.transfers}
        />
      </div>
      {flight.returnAt && (
        <div className="pt-3">
          <Leg
            label="חזור"
            date={formatShortDate(flight.returnAt)}
            depTime={localTime(flight.returnAt)}
            depCode={flight.destinationAirport}
            arr={retArr}
            arrCode={flight.originAirport}
            durationMin={flight.returnDurationMinutes ?? 0}
            transfers={flight.returnTransfers ?? 0}
          />
        </div>
      )}
    </div>
  );
}
