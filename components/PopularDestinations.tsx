import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/travel/destinations";
import { getDestinationImage } from "@/lib/travel/destination-image";
import { searchFlights } from "@/providers/travelpayouts/data";
import { formatPrice } from "@/lib/travel/format";

/** חודש כ-30 יום קדימה, YYYY-MM (לחיפוש "מחיר מ-"). */
function nextMonth(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** המחיר הזול ביותר להלוך-חזור מ-TLV ליעד (או null אם אין נתון). */
async function cheapestPrice(code: string, month: string): Promise<number | null> {
  try {
    const rows = await searchFlights({
      origin: "TLV",
      destination: code,
      departDate: month,
      returnDate: month,
      limit: 30,
    });
    const prices = rows
      .filter((r) => r.returnAt && r.price > 0)
      .map((r) => r.price);
    return prices.length ? Math.min(...prices) : null;
  } catch {
    return null;
  }
}

/**
 * בלוק "לאן בא לכם?" בדף הבית (סעיף 108 באפיון) — יעדים פופולריים עם תמונה
 * ומחיר הלוך-חזור זול, שמקשרים לעמודי היעד (SEO). Server Component, cached.
 */
export async function PopularDestinations() {
  const month = nextMonth();
  const cards = await Promise.all(
    DESTINATIONS.map(async (d) => {
      const [image, price] = await Promise.all([
        getDestinationImage(d.he),
        cheapestPrice(d.code, month),
      ]);
      return { ...d, image, price };
    }),
  );

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16">
      <h2 className="mb-1 text-center text-2xl font-bold">יעדים פופולריים</h2>
      <p className="mb-6 text-center text-sm text-muted">
        מחיר הלוך-חזור זול מתל אביב + מדריך קצר
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((d) => (
          <Link
            key={d.slug}
            href={`/destinations/${d.slug}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-black/5"
          >
            {d.image && (
              <Image
                src={d.image}
                alt={d.he}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {d.price !== null && (
              <div className="absolute end-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-foreground shadow">
                מ-{formatPrice(d.price, "ils")}
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="text-xl font-bold drop-shadow">{d.he}</div>
              <div className="mt-0.5 line-clamp-2 text-sm text-white/85 drop-shadow">
                {d.intro}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
