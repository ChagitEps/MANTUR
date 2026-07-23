import type { TravelProvider } from "@/providers/types";
import type {
  FlightSearchParams,
  HotelSearchParams,
} from "@/lib/travel/types";

// ה-marker ציבורי (מופיע בכל לינק) — מותר לחשוף ללקוח דרך NEXT_PUBLIC_.
const MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER ?? "";

/** YYYY-MM-DD -> "DDMM" (פורמט קוד החיפוש של Aviasales). */
function ddmm(date: string): string {
  const [, mm = "", dd = ""] = date.split("-");
  return `${dd}${mm}`;
}

/**
 * Travelpayouts — deep-links רשמיים לחיפוש מוקדם-מולא אצל השותף:
 * טיסות דרך Aviasales, מלונות דרך Hotellook. כל לינק נושא את ה-marker,
 * locale=he ו-currency=ils.
 */
export const travelpayouts: TravelProvider = {
  name: "travelpayouts",

  flightSearchUrl({
    originIata,
    destinationIata,
    departDate,
    returnDate,
    adults,
    children = 0,
  }: FlightSearchParams): string {
    // פורמט search-code של Aviasales: ORIGIN + DDMM(יציאה) + DEST + [DDMM(חזרה)] + נוסעים.
    // נוסעים: ספרת מבוגרים, ואם יש ילדים גם ספרת ילדים (מבוגרים, ילדים, תינוקות).
    const ad = Math.min(Math.max(Math.trunc(adults) || 1, 1), 9);
    const ch = Math.min(Math.max(Math.trunc(children) || 0, 0), 9);
    const pax = ch > 0 ? `${ad}${ch}` : String(ad);
    const code =
      originIata.toUpperCase() +
      ddmm(departDate) +
      destinationIata.toUpperCase() +
      (returnDate ? ddmm(returnDate) : "") +
      pax;
    const q = new URLSearchParams({
      marker: MARKER,
      currency: "ils",
      locale: "he",
    });
    return `https://www.aviasales.com/search/${code}?${q.toString()}`;
  },

  hotelSearchUrl({
    destination,
    checkIn,
    checkOut,
    adults,
    rooms,
    children = 0,
  }: HotelSearchParams): string {
    const q = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults: String(adults),
      rooms: String(rooms),
      currency: "ils",
      language: "he",
      marker: MARKER,
    });
    if (children > 0) q.set("children", String(children));
    return `https://search.hotellook.com/?${q.toString()}`;
  },
};

/** נקודת גישה יחידה לספק — נקודת ההחלפה העתידית במקום אחד. */
export function getTravelProvider(): TravelProvider {
  return travelpayouts;
}
