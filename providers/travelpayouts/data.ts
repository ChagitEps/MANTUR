import "server-only";
import type { FlightResult, HotelResult } from "@/lib/travel/types";
import { travelpayouts } from "@/providers/travelpayouts";
import { flightTouchesShabbat } from "@/lib/travel/shabbat";

// טוקן ה-Data API — סודי, צד שרת בלבד. לעולם לא NEXT_PUBLIC.
const TOKEN = process.env.TRAVELPAYOUTS_API_TOKEN ?? "";
const MARKER =
  process.env.TRAVELPAYOUTS_MARKER ??
  process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER ??
  "";

export interface FlightSearchQuery {
  origin: string;
  destination: string;
  /** YYYY-MM-DD או YYYY-MM. */
  departDate: string;
  returnDate?: string;
  currency?: string;
  limit?: number;
}

interface RawFlight {
  link?: string;
  origin_airport?: string;
  destination_airport?: string;
  /** city-directions מחזיר origin/destination (בלי סיומת _airport). */
  origin?: string;
  destination?: string;
  departure_at?: string;
  return_at?: string;
  airline?: string;
  price?: number;
  gate?: string;
  transfers?: number;
  return_transfers?: number;
  duration?: number;
  duration_back?: number;
  flight_number?: string;
}

/**
 * חיפוש מחירי טיסות דרך Travelpayouts (Aviasales Data API), צד שרת בלבד.
 * caching ל-15 דק' (ביצועים + חיסכון בקריאות — mantur-backend skill).
 */
export async function searchFlights(
  q: FlightSearchQuery,
): Promise<FlightResult[]> {
  const currency = q.currency ?? "ils";
  const params = new URLSearchParams({
    origin: q.origin.toUpperCase(),
    destination: q.destination.toUpperCase(),
    departure_at: q.departDate,
    currency,
    sorting: "price",
    limit: String(q.limit ?? 30),
  });
  if (q.returnDate) params.set("return_at", q.returnDate);

  const res = await fetch(
    `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`,
    {
      headers: { "X-Access-Token": TOKEN },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000), // לא לתקוע רינדור על upstream איטי
    },
  );
  if (!res.ok) throw new Error(`travelpayouts flights ${res.status}`);

  const json = (await res.json()) as { data?: RawFlight[] };
  const rows = json.data ?? [];

  const mapped = rows.map((r, i) => {
    const base = r.link ? `https://www.aviasales.com${r.link}` : "";
    const handoffUrl = base
      ? `${base}${base.includes("?") ? "&" : "?"}marker=${MARKER}&currency=${currency}&locale=he`
      : "";
    return {
      id: `${r.origin_airport}-${r.destination_airport}-${r.departure_at}-${r.flight_number ?? i}`,
      price: r.price ?? 0,
      currency,
      airline: r.airline ?? "",
      originAirport: r.origin_airport ?? q.origin.toUpperCase(),
      destinationAirport: r.destination_airport ?? q.destination.toUpperCase(),
      departureAt: r.departure_at ?? "",
      transfers: r.transfers ?? 0,
      durationMinutes: r.duration ?? 0,
      gate: r.gate ?? "",
      handoffUrl,
      returnAt: r.return_at || undefined,
      returnTransfers: r.return_at ? (r.return_transfers ?? 0) : undefined,
      returnDurationMinutes: r.return_at ? (r.duration_back ?? 0) : undefined,
    } satisfies FlightResult;
  });

  // מדיניות שומר שבת (תמיד פעיל): לא מציגים טיסות שממריאות/נוחתות בשבת.
  return mapped.filter((f) => !flightTouchesShabbat(f));
}

export interface AnywhereQuery {
  origin: string;
  /** YYYY-MM-DD או YYYY-MM. חסר = הזול לכל יעד ללא תאריך (city-directions). */
  departDate?: string;
  returnDate?: string;
  currency?: string;
  /** מספר יעדים מקסימלי בתוצאה. */
  limit?: number;
}

/** YYYY-MM-DD מתוך ISO (לבניית deep-link מתויג לשותף). */
function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * חיפוש "לכל מקום" — היעד הזול ביותר לכל קוד יעד ממוצא נתון, ממוין מהזול לגבוה.
 * מחזיר FlightResult[] (כל כרטיס = יעד אחר) כדי שהעמוד יציג רשימת טיסות רגילה.
 * עם תאריך: prices_for_dates עם origin בלבד. בלי תאריך: city-directions.
 * צד שרת בלבד, cache 15 דק'. סינון שבת חל כרגיל.
 */
export async function searchAnywhere(
  q: AnywhereQuery,
): Promise<FlightResult[]> {
  const currency = q.currency ?? "ils";
  const origin = q.origin.toUpperCase();
  const limit = q.limit ?? 40;

  // רשומות גולמיות מנורמלות למבנה משותף (שתי המקורות).
  let rows: RawFlight[];

  if (q.departDate) {
    const params = new URLSearchParams({
      origin,
      departure_at: q.departDate,
      currency,
      sorting: "price",
      limit: "100",
    });
    if (q.returnDate) params.set("return_at", q.returnDate);
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`,
      {
        headers: { "X-Access-Token": TOKEN },
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) throw new Error(`travelpayouts anywhere ${res.status}`);
    const json = (await res.json()) as { data?: RawFlight[] };
    rows = json.data ?? [];
  } else {
    const params = new URLSearchParams({ origin, currency });
    const res = await fetch(
      `https://api.travelpayouts.com/v1/city-directions?${params.toString()}&token=${TOKEN}`,
      { next: { revalidate: 900 }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) throw new Error(`travelpayouts city-directions ${res.status}`);
    const json = (await res.json()) as { data?: Record<string, RawFlight> };
    rows = Object.values(json.data ?? {});
  }

  // סינון שבת + דדופ ליעד (הזול ביותר לכל קוד יעד).
  const cheapest = new Map<string, FlightResult>();
  for (const r of rows) {
    // prices_for_dates → *_airport; city-directions → origin/destination.
    const dest = (r.destination_airport ?? r.destination ?? "").toUpperCase();
    const originCode = (r.origin_airport ?? r.origin ?? origin).toUpperCase();
    const price = r.price ?? 0;
    const departureAt = r.departure_at ?? "";
    if (!dest || dest === origin || price <= 0 || !departureAt) continue;

    const shabbat = flightTouchesShabbat({
      departureAt,
      returnAt: r.return_at || undefined,
      durationMinutes: r.duration ?? 0,
      returnDurationMinutes: r.duration_back ?? 0,
      originAirport: originCode,
      destinationAirport: dest,
    });
    if (shabbat) continue;

    const existing = cheapest.get(dest);
    if (existing && existing.price <= price) continue;

    // handoff: אם יש link (prices_for_dates) — deep-link ישיר מתויג; אחרת
    // (city-directions, בלי תאריך) — search-code מתויג של Aviasales.
    const base = r.link ? `https://www.aviasales.com${r.link}` : "";
    const handoffUrl = base
      ? `${base}${base.includes("?") ? "&" : "?"}marker=${MARKER}&currency=${currency}&locale=he`
      : travelpayouts.flightSearchUrl({
          originIata: origin,
          destinationIata: dest,
          departDate: isoDate(departureAt),
          returnDate: r.return_at ? isoDate(r.return_at) : undefined,
          adults: 1,
        });

    cheapest.set(dest, {
      id: `${originCode}-${dest}-${departureAt}`,
      price,
      currency,
      airline: r.airline ?? "",
      originAirport: originCode,
      destinationAirport: dest,
      departureAt,
      transfers: r.transfers ?? 0,
      durationMinutes: r.duration ?? 0,
      gate: r.gate ?? "",
      handoffUrl,
      returnAt: r.return_at || undefined,
      returnTransfers: r.return_at ? (r.return_transfers ?? 0) : undefined,
      returnDurationMinutes: r.return_at ? (r.duration_back ?? 0) : undefined,
    } satisfies FlightResult);
  }

  return [...cheapest.values()]
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

export interface HotelSearchQuery {
  /** שם עיר באנגלית (מה ש-Hotellook מחפש). */
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
  currency?: string;
}

interface RawHotel {
  hotelId?: number;
  hotelName?: string;
  stars?: number;
  priceFrom?: number;
  priceAvg?: number;
  location?: { name?: string; country?: string };
}

/**
 * חיפוש מלונות דרך Hotellook Data API (cache.json), צד שרת בלבד, cache 15 דק'.
 * הערה: engine.hotellook.com חוסם IP של דאטה-סנטר — יאומת מהדפדפן/Vercel.
 * פרסינג הגנתי: שדה חסר → ברירת מחדל, בלי קריסה.
 */
export async function searchHotels(q: HotelSearchQuery): Promise<HotelResult[]> {
  const currency = q.currency ?? "ils";
  const params = new URLSearchParams({
    location: q.destination,
    checkIn: q.checkIn,
    checkOut: q.checkOut,
    currency,
    limit: "30",
    token: TOKEN,
  });

  const res = await fetch(
    `https://engine.hotellook.com/api/v2/cache.json?${params.toString()}`,
    { headers: { "X-Access-Token": TOKEN }, next: { revalidate: 900 } },
  );
  if (!res.ok) throw new Error(`hotellook ${res.status}`);

  const json = (await res.json()) as RawHotel[];
  const rows = Array.isArray(json) ? json : [];

  const handoffUrl = travelpayouts.hotelSearchUrl({
    destination: q.destination,
    checkIn: q.checkIn,
    checkOut: q.checkOut,
    adults: q.adults,
    rooms: q.rooms,
  });

  return rows
    .filter((h) => (h.priceFrom ?? h.priceAvg ?? 0) > 0)
    .map((h, i) => ({
      id: String(h.hotelId ?? i),
      name: h.hotelName ?? "מלון",
      stars: h.stars ?? 0,
      priceFrom: Math.round(h.priceFrom ?? h.priceAvg ?? 0),
      currency,
      location: h.location?.name ?? q.destination,
      handoffUrl,
    }) satisfies HotelResult);
}
