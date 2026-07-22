import { track } from "@vercel/analytics";

/**
 * מדידת משפך אמיתית דרך Vercel Analytics (client). הגנתי — אם analytics
 * לא זמין (dev/חסימת סקריפט), פשוט מתעלם. בלי נתונים אישיים מזהים.
 */

type SearchKind = "flight" | "hotel";

export function trackSearch(
  kind: SearchKind,
  props: {
    origin?: string;
    destination?: string;
    depart?: string;
    return?: string;
  },
): void {
  try {
    track("search", {
      kind,
      origin: props.origin ?? "",
      destination: props.destination ?? "",
      depart: props.depart ?? "",
      return: props.return ?? "",
    });
  } catch {
    /* analytics לא זמין — מתעלמים */
  }
}

export function trackPartnerClick(
  kind: SearchKind,
  props: { destination?: string } = {},
): void {
  try {
    track("partner_click", { kind, destination: props.destination ?? "" });
  } catch {
    /* analytics לא זמין — מתעלמים */
  }
}
