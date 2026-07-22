import { Header } from "@/components/Header";

/**
 * מעטפת אחידה לעמודי תוכן סטטיים (אודות, תקנון, פרטיות וכו').
 * עיצוב טיפוגרפי בסיסי דרך selectors על התוכן.
 */
export function StaticPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        {updated && <p className="mb-6 text-sm text-muted">עודכן: {updated}</p>}
        <div className="space-y-4 leading-relaxed text-foreground/90 [&_a:hover]:underline [&_a]:text-brand [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:ps-5">
          {children}
        </div>
      </main>
    </>
  );
}
