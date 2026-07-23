export type Scope = "abroad" | "domestic";

export interface FlightSearchParams {
  /** קוד IATA של שדה המוצא, למשל "TLV". */
  originIata: string;
  /** קוד IATA של היעד, למשל "LON". */
  destinationIata: string;
  /** תאריך יציאה, YYYY-MM-DD. */
  departDate: string;
  /** תאריך חזרה, YYYY-MM-DD. חסר = כיוון אחד. */
  returnDate?: string;
  adults: number;
  /** ילדים (גילאי 2–11). */
  children?: number;
}

export interface HotelSearchParams {
  /** שם יעד (עיר/אזור). */
  destination: string;
  /** צ׳ק-אין, YYYY-MM-DD. */
  checkIn: string;
  /** צ׳ק-אאוט, YYYY-MM-DD. */
  checkOut: string;
  adults: number;
  rooms: number;
  /** ילדים (גילאי 2–17). */
  children?: number;
}

/** תוצאת טיסה בודדת (מ-Travelpayouts Data API), מוכנה להצגה. */
export interface FlightResult {
  id: string;
  price: number;
  currency: string;
  /** קוד חברת תעופה (IATA), למשל "W9". */
  airline: string;
  originAirport: string;
  destinationAirport: string;
  /** ISO 8601. */
  departureAt: string;
  transfers: number;
  durationMinutes: number;
  /** מקור ההזמנה, למשל "Kiwi.com". */
  gate: string;
  /** deep-link מתויג (marker) להזמנה אצל השותף. */
  handoffUrl: string;
  /** חזור (הלוך-חזור בלבד). */
  returnAt?: string;
  returnTransfers?: number;
  returnDurationMinutes?: number;
}

/** יעד בודד בתוצאות "לכל מקום" — הזול ביותר לאותו קוד יעד. */
export interface AnywhereResult {
  /** קוד IATA של עיר/שדה היעד. */
  destinationCode: string;
  /** המחיר הזול שנמצא ליעד. */
  priceFrom: number;
  currency: string;
  /** ISO 8601 — יציאת הטיסה הזולה שנמצאה. */
  departureAt: string;
  returnAt?: string;
  transfers: number;
  /** deep-link מתויג (marker) לחיפוש אצל השותף. */
  handoffUrl: string;
}

/** תוצאת מלון בודדת (מ-Hotellook Data API), מוכנה להצגה. */
export interface HotelResult {
  id: string;
  name: string;
  stars: number;
  priceFrom: number;
  currency: string;
  location: string;
  /** deep-link מתויג (marker) להזמנה אצל השותף. */
  handoffUrl: string;
}
