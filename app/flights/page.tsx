import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { FlightResultCard } from "@/components/FlightResultCard";
import { searchFlights } from "@/providers/travelpayouts/data";
import { getTravelProvider } from "@/providers/travelpayouts";
import { getDestinationImage } from "@/lib/travel/destination-image";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import type { FlightResult } from "@/lib/travel/types";

export const metadata: Metadata = {
  title: "תוצאות טיסות — MANTUR",
  robots: { index: false }, // עמוד חיפוש דינמי — לא לאינדוקס.
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

function shortName(name: string): string {
  return name.split(/[(,]/)[0].trim();
}

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const origin = one(sp.origin).toUpperCase();
  const destination = one(sp.destination).toUpperCase();
  const destName = one(sp.destName);
  const departDate = one(sp.depart);
  const returnDate = one(sp.return) || undefined;
  const adults = Number(one(sp.adults)) || 1;

  const valid = Boolean(origin && destination && departDate);

  let results: FlightResult[] = [];
  let failed = false;
  let heroImage: string | null = null;

  if (valid) {
    // תאריך מדויק בלבד — בלי קירוב לחודש (בקשת המשתמשת).
    const [flightsRes, img] = await Promise.all([
      searchFlights({ origin, destination, departDate, returnDate }).then(
        (r) => ({ ok: true as const, r }),
        () => ({ ok: false as const, r: [] as FlightResult[] }),
      ),
      destName ? getDestinationImage(destName) : Promise.resolve(null),
    ]);
    results = flightsRes.r;
    failed = !flightsRes.ok;
    heroImage = img;
  }

  const title = destName ? `טיסות ל${shortName(destName)}` : `טיסות ${origin} ← ${destination}`;

  // כשאין מחיר שמור לתאריך המדויק — חיפוש חי אצל השותף לאותם תאריכים בדיוק.
  const partnerUrl = valid
    ? getTravelProvider().flightSearchUrl({
        originIata: origin,
        destinationIata: destination,
        departDate,
        returnDate,
        adults,
      })
    : "";
  const datesLabel = `${departDate}${returnDate ? ` – ${returnDate}` : ""}`;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {valid && heroImage ? (
          <div className="relative mb-4 aspect-[21/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={heroImage}
              alt={shortName(destName)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-3 start-4 text-3xl font-bold text-white drop-shadow">
              {title}
            </h1>
          </div>
        ) : (
          <h1 className="mb-1 text-2xl font-bold">
            {valid ? title : "חיפוש טיסות"}
          </h1>
        )}

        {valid && (
          <p className="mb-6 text-sm text-muted">
            {origin} ← {destination} · {departDate}
            {returnDate ? ` – ${returnDate}` : ""} · מחירים אינדיקטיביים
          </p>
        )}

        {!valid && (
          <p className="text-foreground/70">
            חסרים פרטי חיפוש. חזרו לדף הבית והזינו מוצא, יעד ותאריך.
          </p>
        )}

        {valid && failed && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">לא הצלחנו לקבל תוצאות כרגע.</p>
            <p className="mt-1 text-sm text-muted">נסו שוב בעוד מספר דקות.</p>
          </div>
        )}

        {valid && !failed && results.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">
              אין לנו כרגע מחיר שמור לתאריכים האלה.
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              אפשר לבדוק זמינות ומחיר בזמן אמת אצל השותף — לאותם תאריכים בדיוק
              ({datesLabel}).
            </p>
            <a
              href={partnerUrl}
              target="_blank"
              rel="noopener nofollow sponsored"
              className="mt-4 inline-block h-11 rounded-lg bg-brand px-6 text-sm font-semibold leading-[2.75rem] text-brand-foreground transition-opacity hover:opacity-90"
            >
              חיפוש טיסות ל{shortName(destName) || destination} אצל השותף
            </a>
          </div>
        )}

        {valid && results.length > 0 && (
          <div className="mb-4"><AffiliateDisclosure /></div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map((f, i) => {
              const dp = new URLSearchParams({
                origin,
                destination,
                depart: departDate,
                fid: f.id,
              });
              if (destName) dp.set("destName", destName);
              if (returnDate) dp.set("return", returnDate);
              return (
                <FlightResultCard
                  key={`${f.id}-${i}`}
                  flight={f}
                  detailHref={`/flights/detail?${dp.toString()}`}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
