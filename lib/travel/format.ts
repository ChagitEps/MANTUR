export function formatPrice(price: number, currency: string): string {
  const symbol = currency.toLowerCase() === "ils" ? "₪" : "";
  return `${symbol}${price.toLocaleString("he-IL")}`;
}

export function formatDateTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("he-IL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(min: number): string {
  if (!min) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}ש ${m}ד` : `${h}ש`;
}

export function transfersLabel(n: number): string {
  if (n === 0) return "ישירה";
  if (n === 1) return "עצירה אחת";
  return `${n} עצירות`;
}

/** שעה מקומית (HH:MM) מתוך ISO עם offset — השעון של שדה התעופה עצמו. */
export function localTime(iso: string): string {
  const m = iso?.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : "";
}

/** יום קצר (יום-בשבוע · יום · חודש) מתוך ISO, ללא הסחת אזור-זמן. */
export function formatShortDate(iso: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
  return dt.toLocaleDateString("he-IL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * שעת נחיתה מחושבת (המראה + משך) בשעון שדה היעד.
 * מחזיר null אם חסר משך או tz — לא ממציאים שעה שגויה.
 * dayOffset: כמה ימים אחרי ההמראה נוחתים (0 = אותו יום).
 */
export function arrivalTime(
  depIso: string,
  durationMin: number,
  tz?: string,
): { time: string; dayOffset: number } | null {
  if (!depIso || !durationMin || !tz) return null;
  const dep = new Date(depIso);
  if (Number.isNaN(dep.getTime())) return null;
  const arr = new Date(dep.getTime() + durationMin * 60000);
  const time = arr.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  });
  const arrDay = arr.toLocaleDateString("en-CA", { timeZone: tz });
  const dayOffset = Math.round(
    (Date.parse(arrDay) - Date.parse(depIso.slice(0, 10))) / 86400000,
  );
  return { time, dayOffset };
}
