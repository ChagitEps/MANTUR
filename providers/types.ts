import type { FlightSearchParams, HotelSearchParams } from "@/lib/travel/types";

/**
 * חוזה ספק נסיעות. כל ספק (Travelpayouts והלאה) מממש את אותו interface,
 * כך שהחלפת ספק לא דורשת שינוי בשאר המערכת (provider-independence).
 */
export interface TravelProvider {
  readonly name: string;
  /** URL מתויג (marker) לחיפוש טיסות אצל השותף — ל-handoff. */
  flightSearchUrl(params: FlightSearchParams): string;
  /** URL מתויג לחיפוש מלונות אצל השותף — ל-handoff. */
  hotelSearchUrl(params: HotelSearchParams): string;
}
