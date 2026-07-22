/**
 * קואורדינטות + אזור זמן לשדות תעופה — לחישוב זמני שבת (lib/travel/shabbat.ts).
 * ישראל + שדות התעופה העיקריים של היעדים הנתמכים. שדה לא מוכר → fallback ל-TLV.
 */
export interface AirportGeo {
  lat: number;
  lon: number;
  tz: string;
  /** האם בישראל (משפיע על סכמת חגים; לשבת עצמה לא קריטי). */
  il: boolean;
}

const AIRPORTS: Record<string, AirportGeo> = {
  // ישראל
  TLV: { lat: 32.0114, lon: 34.8867, tz: "Asia/Jerusalem", il: true },
  ETM: { lat: 30.0917, lon: 35.0116, tz: "Asia/Jerusalem", il: true },
  VDA: { lat: 29.9403, lon: 34.9358, tz: "Asia/Jerusalem", il: true },
  // קפריסין
  LCA: { lat: 34.8751, lon: 33.6249, tz: "Asia/Nicosia", il: false },
  // יוון
  ATH: { lat: 37.9364, lon: 23.9445, tz: "Europe/Athens", il: false },
  // צרפת (פריז)
  CDG: { lat: 49.0097, lon: 2.5479, tz: "Europe/Paris", il: false },
  ORY: { lat: 48.7233, lon: 2.3794, tz: "Europe/Paris", il: false },
  BVA: { lat: 49.4544, lon: 2.1128, tz: "Europe/Paris", il: false },
  // ספרד (ברצלונה)
  BCN: { lat: 41.2974, lon: 2.0833, tz: "Europe/Madrid", il: false },
  // הולנד
  AMS: { lat: 52.3105, lon: 4.7683, tz: "Europe/Amsterdam", il: false },
  // צ'כיה
  PRG: { lat: 50.1008, lon: 14.26, tz: "Europe/Prague", il: false },
  // הונגריה
  BUD: { lat: 47.4369, lon: 19.2556, tz: "Europe/Budapest", il: false },
  // בריטניה (לונדון)
  LHR: { lat: 51.47, lon: -0.4543, tz: "Europe/London", il: false },
  LGW: { lat: 51.1537, lon: -0.1821, tz: "Europe/London", il: false },
  STN: { lat: 51.885, lon: 0.235, tz: "Europe/London", il: false },
  LTN: { lat: 51.8747, lon: -0.3683, tz: "Europe/London", il: false },
  LCY: { lat: 51.5053, lon: 0.0553, tz: "Europe/London", il: false },
  // איטליה (רומא)
  FCO: { lat: 41.8003, lon: 12.2389, tz: "Europe/Rome", il: false },
  CIA: { lat: 41.7994, lon: 12.5949, tz: "Europe/Rome", il: false },
};

/** ברירת מחדל לשדה לא מוכר — תל אביב (זמני שבת בישראל כרפרנס). */
export const FALLBACK_GEO: AirportGeo = AIRPORTS.TLV;

export function getAirportGeo(iata: string): AirportGeo {
  return AIRPORTS[iata?.toUpperCase()] ?? FALLBACK_GEO;
}
