import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { DESTINATIONS, getDestination } from "@/lib/travel/destinations";
import { getDestinationImage } from "@/lib/travel/destination-image";
import { searchFlights } from "@/providers/travelpayouts/data";
import { formatPrice } from "@/lib/travel/format";
import type { FlightResult } from "@/lib/travel/types";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) return { title: "יעד לא נמצא — MANTUR" };
  const title = `חופשה ב${dest.he} — טיסות זולות ומדריך | MANTUR`;
  const description = `${dest.intro} מתי לטוס, מה לעשות, וכמה עולות טיסות מתל אביב ל${dest.he}.`;
  const image = await getDestinationImage(dest.he);
  const url = `/destinations/${dest.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "he_IL",
      title,
      description,
      url,
      images: image ? [{ url: image, alt: dest.he }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** ממיר ISO לתאריך YYYY-MM-DD (ליצירת קישור חיפוש). */
function isoDate(iso: string): string {
  return iso ? iso.slice(0, 10) : "";
}

/** חודש היעד לחיפוש "טיסות זולות" — כ-30 יום קדימה, YYYY-MM. */
function nextMonth(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function DestinationPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  const month = nextMonth();
  const [heroImage, cheapRaw] = await Promise.all([
    getDestinationImage(dest.he),
    searchFlights({
      origin: "TLV",
      destination: dest.code,
      departDate: month,
      returnDate: month, // הלוך-חזור בתוך החודש
      limit: 12,
    }).catch(() => [] as FlightResult[]),
  ]);

  // רק הלוך-חזור, ייחוד לפי תאריך יציאה, ממוין לפי מחיר (הזול ביותר לכל יום).
  const seen = new Set<string>();
  const cheap = cheapRaw
    .filter((f) => {
      const day = isoDate(f.departureAt);
      if (!f.returnAt || !day || seen.has(day)) return false;
      seen.add(day);
      return true;
    })
    .sort((a, b) => a.price - b.price)
    .slice(0, 6);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {/* Hero */}
        <div className="relative mb-6 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-black/5">
          {heroImage && (
            <Image
              src={heroImage}
              alt={dest.he}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h1 className="absolute bottom-3 start-4 text-3xl font-bold text-white drop-shadow">
            חופשה ב{dest.he}
          </h1>
        </div>

        <p className="text-base leading-relaxed text-foreground/90">
          {dest.intro}
        </p>

        {/* חיפוש מוטמע מכוון ליעד */}
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">
            חיפוש טיסות ומלונות ל{dest.he}
          </h2>
          <SearchBar
            initialDestination={{ code: dest.code, name: dest.he }}
          />
        </section>

        {/* טבלת טיסות זולות */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">
            הטיסות הזולות מתל אביב ל{dest.he} (הלוך-חזור)
          </h2>
          {cheap.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-start text-sm">
                <thead className="bg-black/[0.03] text-muted">
                  <tr>
                    <th className="px-4 py-2 text-start font-medium">יציאה</th>
                    <th className="px-4 py-2 text-start font-medium">חזרה</th>
                    <th className="px-4 py-2 text-start font-medium">מחיר מ־</th>
                    <th className="px-4 py-2 text-start font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {cheap.map((f) => {
                    const day = isoDate(f.departureAt);
                    const ret = f.returnAt ? isoDate(f.returnAt) : "";
                    const href =
                      `/flights?origin=TLV&destination=${dest.code}` +
                      `&destName=${encodeURIComponent(dest.he)}&depart=${day}` +
                      (ret ? `&return=${ret}` : "");
                    const fmtDay = (iso: string) =>
                      new Date(iso).toLocaleDateString("he-IL", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      });
                    return (
                      <tr key={f.id} className="border-t border-border">
                        <td className="px-4 py-3">{fmtDay(f.departureAt)}</td>
                        <td className="px-4 py-3">
                          {f.returnAt ? fmtDay(f.returnAt) : "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {formatPrice(f.price, f.currency)}
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Link
                            href={href}
                            className="font-medium text-brand hover:underline"
                          >
                            חיפוש טיסות ←
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              אין כרגע מחירים להצגה — נסו חיפוש בתאריכים ספציפיים למעלה.
            </p>
          )}
          <p className="mt-2 text-xs text-muted">מחירים אינדיקטיביים, מתעדכנים בזמן החיפוש.</p>
        </section>

        {/* מדריך */}
        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-lg font-semibold">מתי כדאי לטוס</h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              {dest.whenToFly}
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">מה לעשות ב{dest.he}</h2>
            <ul className="list-disc space-y-1 ps-5 text-sm text-foreground/90">
              {dest.whatToDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-8">
          <AffiliateDisclosure />
        </div>
      </main>
    </>
  );
}
