import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { HotelResultCard } from "@/components/HotelResultCard";
import { searchHotels } from "@/providers/travelpayouts/data";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import type { HotelResult } from "@/lib/travel/types";

export const metadata: Metadata = {
  title: "תוצאות מלונות — MANTUR",
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const destination = one(sp.destination);
  const checkIn = one(sp.checkIn);
  const checkOut = one(sp.checkOut);
  const adults = Number(one(sp.adults)) || 2;
  const rooms = Number(one(sp.rooms)) || 1;

  const valid = Boolean(destination && checkIn && checkOut);

  let results: HotelResult[] = [];
  let failed = false;
  if (valid) {
    try {
      results = await searchHotels({
        destination,
        checkIn,
        checkOut,
        adults,
        rooms,
      });
    } catch {
      failed = true;
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">
          {valid ? `מלונות ב${destination}` : "חיפוש מלונות"}
        </h1>
        {valid && (
          <p className="mb-6 text-sm text-muted">
            {checkIn} – {checkOut} · {rooms} חדרים · {adults} אורחים · מחירים
            אינדיקטיביים
          </p>
        )}

        {!valid && (
          <p className="text-foreground/70">
            חסרים פרטי חיפוש. חזרו לדף הבית והזינו יעד ותאריכים.
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
            <p className="font-medium">לא נמצאו מלונות לתאריכים אלה.</p>
            <p className="mt-1 text-sm text-muted">נסו תאריכים או יעד אחר.</p>
          </div>
        )}

        {valid && <div className="mb-4"><AffiliateDisclosure /></div>}

        {results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map((h) => (
              <HotelResultCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
