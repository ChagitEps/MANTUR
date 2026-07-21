import { type NextRequest, NextResponse } from "next/server";
import { PLACES_HE } from "@/lib/travel/places-he";

const HEBREW = /[֐-׿]/;

interface TpPlace {
  code: string;
  name: string;
  type: string;
  country_name?: string;
  city_name?: string;
}

export interface PlaceSuggestion {
  /** ערך מכונה: IATA לטיסות, שם אנגלי למלונות. */
  code: string;
  /** תצוגה למשתמש. */
  name: string;
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const kind = req.nextUrl.searchParams.get("kind") === "hotel" ? "hotel" : "flight";
  if (q.length < 2) return NextResponse.json([]);

  // עברית → הרשימה המתורגמת שלנו.
  if (HEBREW.test(q)) {
    const results: PlaceSuggestion[] = PLACES_HE.filter((p) =>
      p.he.includes(q),
    )
      .slice(0, 6)
      .map((p) => ({ code: kind === "hotel" ? p.en : p.code, name: p.he }));
    return NextResponse.json(results);
  }

  // לטיני → אוטוקומפליט של Travelpayouts.
  const types =
    kind === "hotel" ? "types[]=city" : "types[]=city&types[]=airport";
  try {
    const res = await fetch(
      `https://autocomplete.travelpayouts.com/places2?locale=en&${types}&term=${encodeURIComponent(q)}`,
      { next: { revalidate: 86400 } },
    );
    const data = (await res.json()) as TpPlace[];
    const results: PlaceSuggestion[] = (Array.isArray(data) ? data : [])
      .slice(0, 6)
      .map((p) => ({
        code: kind === "hotel" ? p.name : p.code,
        name:
          p.type === "airport"
            ? `${p.name} (${p.code})`
            : `${p.name}${p.country_name ? ", " + p.country_name : ""}`,
      }));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
