import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/travel/destinations";
import { getDestinationImage } from "@/lib/travel/destination-image";

/**
 * בלוק "לאן בא לכם?" בדף הבית (סעיף 108 באפיון) — יעדים פופולריים עם תמונה,
 * שמקשרים לעמודי היעד (SEO). Server Component: מושך תמונות במקביל (cached).
 */
export async function PopularDestinations() {
  const cards = await Promise.all(
    DESTINATIONS.map(async (d) => ({
      ...d,
      image: await getDestinationImage(d.he),
    })),
  );

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16">
      <h2 className="mb-1 text-center text-2xl font-bold">יעדים פופולריים</h2>
      <p className="mb-6 text-center text-sm text-muted">
        מדריך קצר + הטיסות הזולות מתל אביב
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
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
