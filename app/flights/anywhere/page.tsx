import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FlightResults } from "@/components/FlightResults";
import { searchAnywhere } from "@/providers/travelpayouts/data";
import { PLACES_HE } from "@/lib/travel/places-he";
import type { FlightResult } from "@/lib/travel/types";

export const metadata: Metadata = {
  title: "לכל מקום — הטיסות הזולות מתל אביב | MANTUR",
  robots: { index: false }, // עמוד חיפוש דינמי — לא לאינדוקס.
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
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

  let results: FlightResult[] = [];
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

  // שם עברי לכל יעד — כדי שכל כרטיס ברשימה יזוהה.
  const withNames = results.map((f) => ({
    ...f,
    destinationName: heName(f.destinationAirport),
  }));

  const datesLabel = departDate
    ? `${departDate}${returnDate ? ` – ${returnDate}` : ""}`
    : "התאריכים הזולים ביותר";

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
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

        {!failed && withNames.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">אין לנו כרגע יעדים לתאריכים האלה.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              נסו לבחור תאריכים אחרים, או חפשו בלי לבחור תאריך כדי לראות את
              המחירים הזולים ביותר לכל יעד.
            </p>
          </div>
        )}

        {withNames.length > 0 && (
          <>
            <div className="mb-4">
              <AffiliateDisclosure />
            </div>
            <FlightResults
              key={`${origin}-${departDate ?? ""}-${returnDate ?? ""}`}
              results={withNames}
            />
          </>
        )}
      </main>
    </>
  );
}
