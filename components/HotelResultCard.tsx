import type { HotelResult } from "@/lib/travel/types";

function stars(n: number): string {
  const c = Math.min(5, Math.max(0, Math.round(n)));
  return "★".repeat(c);
}

export function HotelResultCard({ hotel }: { hotel: HotelResult }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold">{hotel.name}</div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {hotel.stars > 0 && (
            <span className="text-amber-500">{stars(hotel.stars)}</span>
          )}
          <span>{hotel.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-start sm:text-end">
          <div className="text-xs text-muted">החל מ-</div>
          <div className="text-2xl font-bold">
            ₪{hotel.priceFrom.toLocaleString("he-IL")}
          </div>
        </div>
        <a
          href={hotel.handoffUrl}
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
