import "server-only";

const HEBREW = /[֐-׿]/;

interface WikiSummary {
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
}

/** מנקה שם יעד לחיפוש בוויקיפדיה: מסיר סוגריים/מדינה. */
function cleanName(name: string): string {
  return name.split(/[(,]/)[0].trim();
}

/**
 * תמונת יעד מוויקיפדיה (חינם, בלי מפתח). עברית → he.wikipedia, אחרת en.
 * צד שרת, cache ליום. מחזיר null אם אין תמונה.
 */
export async function getDestinationImage(
  name: string,
): Promise<string | null> {
  const clean = cleanName(name);
  if (clean.length < 2) return null;
  const lang = HEBREW.test(clean) ? "he" : "en";
  try {
    const res = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(clean)}`,
      {
        next: { revalidate: 86400 },
        headers: { "User-Agent": "MANTUR/1.0" },
        signal: AbortSignal.timeout(5000), // לא לתקוע רינדור על upstream איטי
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as WikiSummary;
    return json.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}
