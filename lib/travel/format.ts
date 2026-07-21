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
