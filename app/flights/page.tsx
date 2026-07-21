import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FlightResultCard } from "@/components/FlightResultCard";
import { searchFlights } from "@/providers/travelpayouts/data";
import type { FlightResult } from "@/lib/travel/types";

export const metadata: Metadata = {
  title: "תוצאות טיסות — MANTUR",
  robots: { index: false }, // עמוד חיפוש דינמי — לא לאינדוקס.
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const origin = one(sp.origin).toUpperCase();
  const destination = one(sp.destination).toUpperCase();
  const departDate = one(sp.depart);
  const returnDate = one(sp.return) || undefined;

  const valid = Boolean(origin && destination && departDate);

  let results: FlightResult[] = [];
  let failed = false;
  if (valid) {
    try {
      results = await searchFlights({ origin, destination, departDate, returnDate });
    } catch {
      failed = true;
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">
          {valid ? `טיסות ${origin} ← ${destination}` : "חיפוש טיסות"}
        </h1>
        {valid && (
          <p className="mb-6 text-sm text-foreground/60">
            {departDate}
            {returnDate ? ` – ${returnDate}` : ""} · מחירים מ-Travelpayouts, אינדיקטיביים
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
            <p className="mt-1 text-sm text-foreground/60">נסו שוב בעוד מספר דקות.</p>
          </div>
        )}

        {valid && !failed && results.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-medium">לא נמצאו טיסות לתאריך הזה.</p>
            <p className="mt-1 text-sm text-foreground/60">
              נסו תאריך אחר, יעד אחר, או חיפוש לכל מקום.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map((f) => {
              const dp = new URLSearchParams({
                origin,
                destination,
                depart: departDate,
                fid: f.id,
              });
              if (returnDate) dp.set("return", returnDate);
              return (
                <FlightResultCard
                  key={f.id}
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
