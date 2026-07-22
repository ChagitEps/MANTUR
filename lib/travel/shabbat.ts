import "server-only";
import { HebrewCalendar, Location } from "@hebcal/core";
import { getAirportGeo, type AirportGeo } from "@/lib/travel/airport-coords";

const DAY = 86_400_000;
const HOUR = 3_600_000;

interface Window {
  start: number;
  end: number;
}

// מטמון חלונות שבת לפי מיקום + יום (UTC), כדי לא לחשב שוב לכל טיסה.
const cache = new Map<string, Window[]>();

/** חלונות שבת (הדלקת נרות שישי → צאת שבת מוצ״ש) סביב רגע נתון, במיקום נתון. */
function windowsAround(instant: Date, geo: AirportGeo): Window[] {
  const key = `${geo.lat},${geo.lon},${Math.floor(instant.getTime() / DAY)}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const loc = new Location(geo.lat, geo.lon, geo.il, geo.tz);
  const events = HebrewCalendar.calendar({
    start: new Date(instant.getTime() - 3 * DAY),
    end: new Date(instant.getTime() + 3 * DAY),
    location: loc,
    candlelighting: true,
  });

  const candles: number[] = [];
  const havdalahs: number[] = [];
  for (const ev of events) {
    const t = (ev as { eventTime?: Date }).eventTime;
    if (!t) continue;
    const desc = ev.getDesc();
    const dow = ev.getDate().greg().getDay(); // 0=ראשון .. 6=שבת
    if (desc === "Candle lighting" && dow === 5) candles.push(t.getTime());
    else if (desc === "Havdalah" && dow === 6) havdalahs.push(t.getTime());
  }
  candles.sort((a, b) => a - b);
  havdalahs.sort((a, b) => a - b);

  const windows: Window[] = [];
  for (const c of candles) {
    const h = havdalahs.find((x) => x > c && x - c < 30 * HOUR);
    if (h) windows.push({ start: c, end: h });
  }
  cache.set(key, windows);
  return windows;
}

function isInstantOnShabbat(instantMs: number, iata: string): boolean {
  const windows = windowsAround(new Date(instantMs), getAirportGeo(iata));
  return windows.some((w) => instantMs >= w.start && instantMs <= w.end);
}

interface FlightLike {
  departureAt: string;
  returnAt?: string;
  durationMinutes: number;
  returnDurationMinutes?: number;
  originAirport: string;
  destinationAirport: string;
}

/**
 * האם הטיסה נוגעת בשבת — המראה או נחיתה, הלוך או חזור, בתוך זמן שבת.
 * זמני שבת מדויקים (@hebcal/core) לפי מיקום כל שדה תעופה.
 */
export function flightTouchesShabbat(f: FlightLike): boolean {
  const dep = Date.parse(f.departureAt);
  if (Number.isNaN(dep)) return false;

  // הלוך: המראה במוצא, נחיתה ביעד.
  if (isInstantOnShabbat(dep, f.originAirport)) return true;
  if (
    f.durationMinutes > 0 &&
    isInstantOnShabbat(dep + f.durationMinutes * 60_000, f.destinationAirport)
  )
    return true;

  // חזור: המראה ביעד, נחיתה במוצא.
  if (f.returnAt) {
    const ret = Date.parse(f.returnAt);
    if (!Number.isNaN(ret)) {
      if (isInstantOnShabbat(ret, f.destinationAirport)) return true;
      const back = f.returnDurationMinutes ?? 0;
      if (back > 0 && isInstantOnShabbat(ret + back * 60_000, f.originAirport))
        return true;
    }
  }
  return false;
}
