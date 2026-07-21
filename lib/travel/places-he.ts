/**
 * רשימה מתורגמת של יעדים פופולריים לקהל הישראלי — לחיפוש בעברית.
 * ה-API של Travelpayouts לא מחזיר עברית, לכן זו הרשימה הידנית שלנו.
 * `code` = IATA (לטיסות); `en` = שם אנגלי (לחיפוש מלונות); `he` = תצוגה/חיפוש בעברית.
 * הזנב הארוך מכוסה ב-fallback לאוטוקומפליט האנגלי של Travelpayouts.
 */
export interface HePlace {
  code: string;
  he: string;
  en: string;
}

export const PLACES_HE: HePlace[] = [
  // ישראל (תיירות פנים)
  { code: "TLV", he: "תל אביב", en: "Tel Aviv" },
  { code: "JRS", he: "ירושלים", en: "Jerusalem" },
  { code: "ETH", he: "אילת", en: "Eilat" },
  { code: "HFA", he: "חיפה", en: "Haifa" },
  { code: "TBR", he: "טבריה", en: "Tiberias" },
  { code: "DSM", he: "ים המלח", en: "Dead Sea" },
  { code: "NAT", he: "נתניה", en: "Netanya" },
  { code: "HRZ", he: "הרצליה", en: "Herzliya" },
  { code: "TZF", he: "צפת", en: "Safed" },
  { code: "MZR", he: "מצפה רמון", en: "Mitzpe Ramon" },
  // אירופה
  { code: "LON", he: "לונדון", en: "London" },
  { code: "PAR", he: "פריז", en: "Paris" },
  { code: "ROM", he: "רומא", en: "Rome" },
  { code: "MIL", he: "מילאנו", en: "Milan" },
  { code: "VCE", he: "ונציה", en: "Venice" },
  { code: "NAP", he: "נאפולי", en: "Naples" },
  { code: "FLR", he: "פירנצה", en: "Florence" },
  { code: "BCN", he: "ברצלונה", en: "Barcelona" },
  { code: "MAD", he: "מדריד", en: "Madrid" },
  { code: "AMS", he: "אמסטרדם", en: "Amsterdam" },
  { code: "BER", he: "ברלין", en: "Berlin" },
  { code: "MUC", he: "מינכן", en: "Munich" },
  { code: "FRA", he: "פרנקפורט", en: "Frankfurt" },
  { code: "VIE", he: "וינה", en: "Vienna" },
  { code: "PRG", he: "פראג", en: "Prague" },
  { code: "BUD", he: "בודפשט", en: "Budapest" },
  { code: "ATH", he: "אתונה", en: "Athens" },
  { code: "SKG", he: "סלוניקי", en: "Thessaloniki" },
  { code: "LIS", he: "ליסבון", en: "Lisbon" },
  { code: "OPO", he: "פורטו", en: "Porto" },
  { code: "ZRH", he: "ציריך", en: "Zurich" },
  { code: "GVA", he: "ז׳נבה", en: "Geneva" },
  { code: "BRU", he: "בריסל", en: "Brussels" },
  { code: "CPH", he: "קופנהגן", en: "Copenhagen" },
  { code: "DUB", he: "דבלין", en: "Dublin" },
  { code: "WAW", he: "ורשה", en: "Warsaw" },
  { code: "KRK", he: "קרקוב", en: "Krakow" },
  { code: "OTP", he: "בוקרשט", en: "Bucharest" },
  { code: "SOF", he: "סופיה", en: "Sofia" },
  { code: "NCE", he: "ניס", en: "Nice" },
  { code: "MLA", he: "מלטה", en: "Malta" },
  { code: "TBS", he: "טביליסי", en: "Tbilisi" },
  { code: "BUS", he: "בטומי", en: "Batumi" },
  // ים תיכון / יעדי סופ״ש
  { code: "LCA", he: "לרנקה", en: "Larnaca" },
  { code: "PFO", he: "פאפוס", en: "Paphos" },
  { code: "IST", he: "איסטנבול", en: "Istanbul" },
  { code: "AYT", he: "אנטליה", en: "Antalya" },
  // המזרח התיכון / המפרץ
  { code: "DXB", he: "דובאי", en: "Dubai" },
  { code: "AUH", he: "אבו דאבי", en: "Abu Dhabi" },
  // ארה״ב
  { code: "NYC", he: "ניו יורק", en: "New York" },
  { code: "LAX", he: "לוס אנג׳לס", en: "Los Angeles" },
  { code: "MIA", he: "מיאמי", en: "Miami" },
  { code: "LAS", he: "לאס וגאס", en: "Las Vegas" },
  // אסיה
  { code: "BKK", he: "בנגקוק", en: "Bangkok" },
  { code: "HKT", he: "פוקט", en: "Phuket" },
  { code: "DPS", he: "באלי", en: "Bali" },
  { code: "TYO", he: "טוקיו", en: "Tokyo" },
  { code: "SIN", he: "סינגפור", en: "Singapore" },
  { code: "DEL", he: "דלהי", en: "Delhi" },
  { code: "GOI", he: "גואה", en: "Goa" },
  { code: "CMB", he: "קולומבו", en: "Colombo" },
  // אפריקה
  { code: "RAK", he: "מרקש", en: "Marrakesh" },
  { code: "ZNZ", he: "זנזיבר", en: "Zanzibar" },
  { code: "SSH", he: "שארם א-שייח׳", en: "Sharm El Sheikh" },
];
