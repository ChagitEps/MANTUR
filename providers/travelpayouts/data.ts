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
    },
  );
  if (!res.ok) throw new Error(`travelpayouts flights ${res.status}`);

  const json = (await res.json()) as { data?: RawFlight[] };
  const rows = json.data ?? [];

  const mapped = rows.map((r, i) => {
    const base = r.link ? `https://www.aviasales.com${r.link}` : "";
    const handoffUrl = base
      ? `${base}${base.includes("?") ? "&" : "?"}marker=${MARKER}&currency=${currency}`
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
