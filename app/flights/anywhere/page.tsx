import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { searchAnywhere } from "@/providers/travelpayouts/data";
import { getDestinationImage } from "@/lib/travel/destination-image";
import { PLACES_HE } from "@/lib/travel/places-he";
import { formatPrice } from "@/lib/travel/format";
import type { AnywhereResult } from "@/lib/travel/types";

export const metadata: Metadata = {
  title: "לכל מקום — הטיסות הזולות מתל אביב | MANTUR",
  robots: { index: false }, // עמוד חיפוש דינמי — לא לאינדוקס.
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

/** YYYY-MM-DD מתוך ISO. */
function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

// city-directions מחזיר לעיתים קודי-מטרו (עיר), שלא תמיד תואמים את קוד השדה
// ב-PLACES_HE — השלמה קצרה לשמות העבריים הנפוצים.
const METRO_HE: Record<string, string> = {
  BUH: "בוקרשט",
  MOW: "מוסקבה",
  LED: "סנט פטרבורג",
  AER: "סוצ׳י",
  EVN: "ירוואן",
  VNO: "וילנה",
  KUT: "קוטאיסי",
  RIX: "ריגה",
  TLL: "טאלין",
};

const HE_BY_CODE = new Map<string, string>([
  ...PLACES_HE.map((p) => [p.code, p.he] as const),
  ...Object.entries(METRO_HE),
]);

/** שם עברי לקוד יעד, או הקוד עצמו אם אין תרגום. */
function heName(code: string): string {
  return HE_BY_CODE.get(code) ?? code;
}

export default async function AnywherePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const origin = (one(sp.origin) || "TLV").toUpperCase();
  const departDate = one(sp.depart) || undefined;
  const returnDate = one(sp.return) || undefined;

  let results: AnywhereResult[] = [];
  let failed = false;
  try {
    results = await searchAnywhere({
      origin,
      departDate,
      returnDate,
      limit: 24,
    });
  } catch {
    failed = true;
  }

  // תמונת יעד לכל תוצאה (עברית → he.wikipedia). null אם אין.
  const cards = await Promise.all(
    results.map(async (r) => {
      const he = heName(r.destinationCode);
      return { ...r, he, image: await getDestinationImage(he) };
    }),
  );

  const datesLabel = departDate
    ? `${departDate}${returnDate ? ` – ${returnDate}` : ""}`
    : "התאריכים הזולים ביותר";

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">לכל מקום</h1>
        <p className="mb-2 text-sm text-muted">
          היעדים הזולים לטיסה מ־{origin} · {datesLabel} · מהזול ליקר
        </p>
        <p className="mb-6 text-xs text-muted">
          🕯️ שומר שבת: לא מוצגות טיסות שממריאות או נוחתות בשבת.
        </p>

        {failed && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">לא הצלחנו לקבל תוצאות כרגע.</p>
            <p className="mt-1 text-sm text-muted">נסו שוב בעוד מספר דקות.</p>
          </div>
        )}

        {!failed && cards.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">אין לנו כרגע יעדים לתאריכים האלה.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              נסו לבחור תאריכים אחרים, או חפשו בלי לבחור תאריך כדי לראות את
              המחירים הזולים ביותר לכל יעד.
            </p>
          </div>
        )}

        {cards.length > 0 && (
          <>
            <div className="mb-4">
              <AffiliateDisclosure />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((d) => {
                const params = new URLSearchParams({
                  origin,
                  destination: d.destinationCode,
                  destName: d.he,
                  depart: isoDate(d.departureAt),
                });
                if (d.returnAt) params.set("return", isoDate(d.returnAt));
                return (
                  <Link
                    key={d.destinationCode}
                    href={`/flights?${params.toString()}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-black/5"
                  >
                    {d.image && (
                      <Image
                        src={d.image}
                        alt={d.he}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute end-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-foreground shadow">
                      מ-{formatPrice(d.priceFrom, d.currency)}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <div className="text-xl font-bold drop-shadow">{d.he}</div>
                      <div className="mt-0.5 text-sm text-white/85 drop-shadow">
                        {isoDate(d.departureAt)}
                        {d.returnAt ? ` – ${isoDate(d.returnAt)}` : ""} ·{" "}
                        {d.transfers === 0 ? "ישירה" : "לצפייה בטיסות"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}
